import type {HydratedDocument, Types} from 'mongoose';
import type {ShareTime} from './model';
import ShareTimeModel from './model';
import UserCollection from '../user/collection';
import e from 'express';

/**
 * This files contains a class that has the functionality to explore shareTime
 * stored in MongoDB, including adding, finding, and updating shareTime.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<ShareTime> is the output of the ShareTimeModel() constructor,
 * and contains all the information in ShareTime. https://mongoosejs.com/docs/typescript.html
 */
class ShareTimeCollection {
  /**
   * Add a shareTime to the collection
   *
   * @param {string} authorId - The id of the author of the shareTime
   * @param {string} content - The id of the content of the shareTime
   * @return {Promise<HydratedDocument<ShareTime>>} - The newly created shareTime
   */
  static async addOne(authorId: Types.ObjectId | string): Promise<HydratedDocument<ShareTime>> {
    // const date = new Date();
    const date = new Date('1995-12-17T03:24:00')
    const shareTime = new ShareTimeModel({
      authorId,
      lastLogin: date,
      currentDaily: 0,
      currentWeekly: [0, 0, 0, 0, 0, 0, 0],
      currentWeekday: 0,
      lastWeekly: 0,
      trend: 0
    });
    await shareTime.save(); // Saves shareTime to MongoDB
    return shareTime.populate('authorId');
  }

  /**
   * Find a shareTime by username
   *
   * @param {string} username - The username of the shareTime to find
   * @return {Promise<HydratedDocument<ShareTime>> | Promise<null> } - The shareTime with the given username, if any
   */
  static async findOne(username: string): Promise<HydratedDocument<ShareTime>> {
    const author = await UserCollection.findOneByUsername(username);
    return ShareTimeModel.findOne({authorId: author._id}).populate('authorId');
  }

  /**
   * Find a shareTime by id
   *
   * @param {string} userId - The userId of the shareTime to find
   * @return {Promise<HydratedDocument<ShareTime>> | Promise<null> } - The shareTime with the given username, if any
   */
   static async findOneById(userId: Types.ObjectId | string): Promise<HydratedDocument<ShareTime>> {
    return ShareTimeModel.findOne({authorId: userId}).populate('authorId');
  }

  /**
   * Update a shareTime with logout
   *
   * @param {string} authorId - The id of the shareTime to be updated
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
  static async updateLogout(authorId: Types.ObjectId | string): Promise<HydratedDocument<ShareTime>> {
    const shareTime = await ShareTimeModel.findOne({authorId: authorId});
    // export type ShareTime = {
    //     _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    //     authorId: Types.ObjectId;
    //     lastLogin: Date;
    //     currentDaily: Number;
    //     currentWeekly: [Number, Number, Number, Number, Number, Number, Number];
    //     currentWeekday: Number;
    //     lastWeekly: Number;
    //     trend: Number;
    //   };
    const lastLogin = shareTime.lastLogin;
    
    const today = new Date();
    
    const thisYear = today.getUTCFullYear() == lastLogin.getUTCFullYear();
    const thisDate = today.getUTCDate() == lastLogin.getUTCDate();
    const thisMonth = today.getUTCMonth() == lastLogin.getUTCMonth();
    // const thisDay = today.getUTCDay() == lastLogin.getUTCDay();

    if (thisDate && thisMonth && thisYear){
        let elapsed = Date.now() - shareTime.lastLogin.getTime();
        shareTime.$inc("currentDaily", elapsed);
    }

    await shareTime.save();
    return shareTime.populate('authorId');
  }

  /**
   * Update a shareTime with new logIn
   *
   * @param {string} authorId - The id of the shareTime to be updated
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated shareTime
   */
   static async updateLogIn(authorId: Types.ObjectId | string): Promise<HydratedDocument<ShareTime>> {
    const shareTime = await ShareTimeModel.findOne({authorId: authorId});
    // export type ShareTime = {
    //     _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    //     authorId: Types.ObjectId;
    //     lastLogin: Date;
    //     currentDaily: Number;
    //     currentWeekly: [Number, Number, Number, Number, Number, Number, Number];
    //     lastWeekly: Number;
    //     trend: Number;
    //   };
    const today = new Date();
    const fresh = shareTime.lastLogin.getUTCFullYear() == 1995;
    const thisYear = today.getUTCFullYear() == shareTime.lastLogin.getUTCFullYear();
    const thisDate = today.getUTCDate() == shareTime.lastLogin.getUTCDate();
    const thisMonth = today.getUTCMonth() == shareTime.lastLogin.getUTCMonth();
    const thisDay = today.getUTCDay() == shareTime.lastLogin.getUTCDay();

    if (!(thisYear && thisMonth && thisDate) && !fresh){
        shareTime.currentWeekly[Number(shareTime.currentWeekday)] = Number(shareTime.currentDaily);
        if (shareTime.currentWeekday == 6){
            const newSum = shareTime.currentWeekly.reduce((sum, a) => Number(sum) + Number(a), 0);
            let newAvg = Number(newSum)/7;
            newAvg = newAvg/1000;
            newAvg = newAvg/60;
            newAvg = newAvg/60;
            shareTime.trend = ((newAvg <= Number(shareTime.lastWeekly) + 1) && (newAvg >= Number(shareTime.lastWeekly) - 1))? 0 : (newAvg > shareTime.lastWeekly)? 1 : -1;
            shareTime.lastWeekly = newAvg;
            shareTime.currentWeekly = [0, 0, 0, 0, 0, 0, 0];
        }
        shareTime.currentWeekday = (Number(shareTime.currentWeekday) + 1) % 7
    }

    shareTime.lastLogin = today;
    
    await shareTime.save();
    return shareTime.populate('authorId');
  }

  /**
   * Delete profile
   *
   * @param {string} authorId - The id of author of shareTime
   */
  static async deleteOne(authorId: Types.ObjectId | string): Promise<void> {
    await ShareTimeModel.deleteOne({authorId: authorId});
  }
}

export default ShareTimeCollection;