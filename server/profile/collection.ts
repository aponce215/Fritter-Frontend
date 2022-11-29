import type {HydratedDocument, Types} from 'mongoose';
import type {Profile} from './model';
import ProfileModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to view a profile
 *
 * Note: HydratedDocument<Profile> is the output of the ProfileModel() constructor,
 * and contains all the information in Profile. https://mongoosejs.com/docs/typescript.html
 */
class ProfileCollection {
  /**
   * Add a Profile to the collection.
   *
   * @param {string} authorId - The id of the author of the profile
   * @param {string} content - The id of the content of the profile
   * @return {Promise<HydratedDocument<Profile>>} - The newly created profile
   */
  static async addOne(authorId: Types.ObjectId | string, username: string): Promise<HydratedDocument<Profile>> {
    const date = new Date();
    const profile = new ProfileModel({
      authorId,
      description: "Insert Profile Description Here",
      displayName: username,
      birthday: date.toDateString(),
      showBirthday: true,
    });
    
    await profile.save(); // Saves profile to MongoDB
    return profile.populate('authorId');
  }

  /**
   * Find a profile by username
   *
   * @param {string} username - The username of author of profile
   * @return {Promise<HydratedDocument<Profile>> | Promise<null> } - The profile associated with username, if any
   */
  static async findOne(username: string): Promise<HydratedDocument<Profile>> {
    const author = await UserCollection.findOneByUsername(username);

    return ProfileModel.findOne({authorId: author._id}).populate('authorId');
  }

  /**
   * Find a profile by id
   *
   * @param {string} userId - The username of author of profile
   * @return {Promise<HydratedDocument<Profile>> | Promise<null> } - The profile associated with username, if any
   */
   static async findOneById(userId: Types.ObjectId | string): Promise<HydratedDocument<Profile>> {
    return ProfileModel.findOne({authorId: userId}).populate('authorId');
  }

  /**
   * Update a profile with the new content
   *
   * @param {string} authorId - The id of the profile to be updated
   * @param {string} description - The new description of the profile
   * @param {string} displayName - The new display name of the profile
   * @param {string} birthday - The new birthday of the profile
   * @return {Promise<HydratedDocument<Profile>>} - The newly updated profile
   */
  static async updateOne(authorId: Types.ObjectId | string, description: string, displayName: string, birthday: string): Promise<HydratedDocument<Profile>> {
    const profile = await ProfileModel.findOne({authorId: authorId});

    if (description){
        profile.description = description;
    }
    if (displayName){
        profile.displayName = displayName;
    }
    if (birthday){
        profile.birthday = birthday
    }
    
    await profile.save();
    return profile.populate('authorId');
  }

  /**
   * Update birthday privacy settings
   *
   * @param {string} userId - The id of the profile to be updated
   * @param {Boolean} birthday - Show birthday (true or false)
   * @return {Promise<HydratedDocument<Profile>>} - The newly updated profile
   */
  static async updateBirthday(userId: Types.ObjectId | string, birthday: Boolean): Promise<HydratedDocument<Profile>> {
    const profile = await ProfileModel.findOne({authorId: userId});

    profile.showBirthday = birthday;
    
    await profile.save();
    return profile.populate('authorId');
  }

  /**
   * Delete a user from the collection.
   *
   * @param {string} userId - The userId of user to delete
   * @return {Promise<Boolean>} - true if the user has been deleted, false otherwise
   */
  static async deleteOne(userId: Types.ObjectId | string): Promise<boolean> {
    const user = await ProfileModel.deleteOne({authorId: userId});
    return user !== null;
  }
}

export default ProfileCollection;