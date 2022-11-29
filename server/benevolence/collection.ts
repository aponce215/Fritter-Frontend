import type {HydratedDocument, Types} from 'mongoose';
import type {Benevolence} from './model';
import BenevolenceModel from './model';
import UserCollection from '../user/collection';


/**
 * This files contains a class that has the functionality to explore benevolence
 * stored in MongoDB, including adding, finding, and updating benevolence.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Benevolence> is the output of the BenevolenceModel() constructor,
 * and contains all the information in Benevolence. https://mongoosejs.com/docs/typescript.html
 */
class BenevolenceCollection {
  /**
   * Add a Benevolence to the collection
   *
   * @param {string} authorId - The id of the author of the benevolence
   * @return {Promise<HydratedDocument<Benevolence>>} - The newly created benevolence
   */
  static async addOne(authorId: Types.ObjectId | string): Promise<HydratedDocument<Benevolence>> {
    const benevolence = new BenevolenceModel({
      authorId,
      nominations: 0,
      reports: 0,
      granted: false,
      myVotes: [],
      myReports: [],
    });
    await benevolence.save(); // Saves benevolence to MongoDB
    return benevolence.populate('authorId');
  }

  /**
   * Find a benevolence by username
   *
   * @param {string} username - The username of benevolence to find
   * @return {Promise<HydratedDocument<Benevolence>> | Promise<null> } - The benevolence with the given Id, if any
   */
  static async findOne(username: string): Promise<HydratedDocument<Benevolence>> {
    const author = await UserCollection.findOneByUsername(username);
    return BenevolenceModel.findOne({authorId: author._id}).populate('authorId');
  }

  /**
   * Find a benevolence by username
   *
   * @param {string} userId - The username of benevolence to find
   * @return {Promise<HydratedDocument<Benevolence>> | Promise<null> } - The benevolence with the given Id, if any
   */
   static async findOneById(userId: Types.ObjectId | string): Promise<HydratedDocument<Benevolence>> {
    const benevolence = await BenevolenceModel.findOne({authorId: userId}).populate(['authorId','myVotes','myReports']);
    return benevolence;
  }

  /**
   * Update a benevolence with the new content
   *
   * @param {string} username - The username of the person to be reported
   * @param {string} reporter - The person who is reporting user
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
   static async report(username: string, reporter: Types.ObjectId | string): Promise<HydratedDocument<Benevolence>> {
    const userToReport = await UserCollection.findOneByUsername(username);
    const benevolence = await BenevolenceModel.findOne({authorId: userToReport._id});

    const benevolenceR = await BenevolenceModel.findOne({authorId: reporter});
    const reports = benevolenceR.myReports;
    
    for (const person of reports){
        if (person === userToReport._id){
            return benevolenceR.populate(['authorId','myVotes','myReports']);
        }
    }

    benevolenceR.myReports.push(userToReport._id);

    benevolence.$inc("reports", 1);
    
    if (benevolence.reports >= 2 * Number(benevolence.nominations)){
        benevolence.granted = false;
    }

    await benevolence.save();
    await benevolenceR.save();
    // await benevolenceR.populate('myVotes');
    // await benevolenceR.populate('myReports');
    return benevolenceR.populate(['authorId','myVotes','myReports']);
  }

  /**
   * Update a benevolence with the new content
   *
   * @param {string} username - The username of the person to be reported
   * @param {string} reporter - The person who is reporting user
   * @return {Promise<HydratedDocument<Freet>>} - The benevolence of user
   */
   static async nominate(username: string, reporter: Types.ObjectId | string): Promise<HydratedDocument<Benevolence>> {
    const userToReport = await UserCollection.findOneByUsername(username);
    const benevolence = await BenevolenceModel.findOne({authorId: userToReport._id});

    const benevolenceR = await BenevolenceModel.findOne({authorId: reporter});
    const votes = benevolenceR.myVotes;

    if (votes.length >= 3){
        return benevolenceR.populate(['authorId','myVotes','myReports']);
    }

    benevolenceR.myVotes.push(userToReport._id);
    benevolence.$inc("nominations", 1);

    if (2 * Number(benevolence.nominations) > benevolence.reports){
        benevolence.granted = true;
    }

    await benevolence.save();
    await benevolenceR.save();
    // await benevolenceR.populate('myVotes');
    // await benevolenceR.populate('myReports');
    return benevolenceR.populate(['authorId','myVotes','myReports']);
  }


  /**
   * Delete benevolence by the given author
   *
   * @param {string} authorId - The id of author of benevolence
   */
  static async deleteOne(authorId: Types.ObjectId | string): Promise<void> {
    await BenevolenceModel.deleteOne({authorId: authorId});
  }
}

export default BenevolenceCollection;