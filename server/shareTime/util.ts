import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {ShareTime, PopulatedShareTime} from './model';

// Update this if you add a property to the User type!
type ShareTimeResponse = {
  _id: string;
  author: string;
  lastWeekly: string;
  trend: string;
};

type MyShareTimeResponse = {
    _id: string;
    author: string;
    lastWeekly: string;
    currentDaily: string;
    currentWeekly: string;
    currentWeekday: string;
    trend: string;
};

// export type ShareTime = {
//     _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
//     authorId: Types.ObjectId;
//     lastLogin: Date;
//     currentDaily: Number;
//     currentWeekly: [Number, Number, Number, Number, Number, Number, Number];
//     lastWeekly: Number;
//     trend: Number;
// };

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw User object from the database into an object
 * with all the information needed by the frontend
 * (in this case, removing the password for security)
 *
 * @param {HydratedDocument<User>} user - A user object
 * @returns {UserResponse} - The user object without the password
 */
const constructShareTimeResponse = (shareTime: HydratedDocument<ShareTime>): ShareTimeResponse => {
  const shareTimeCopy: PopulatedShareTime = {
    ...shareTime.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  const {username} = shareTimeCopy.authorId;
  delete shareTimeCopy.authorId;

  return {
    _id: shareTimeCopy._id.toString(),
    author: username,
    lastWeekly: shareTimeCopy.lastWeekly.toString(),
    trend: (shareTimeCopy.trend == -1 ) ? "decreasing" : (shareTimeCopy.trend == 1) ? "increasing" : "stable",
  };
};

/**
 * Transform a raw User object from the database into an object
 * with all the information needed by the frontend
 * (in this case, removing the password for security)
 *
 * @param {HydratedDocument<User>} user - A user object
 * @returns {UserResponse} - The user object without the password
 */
 const constructMyShareTimeResponse = (shareTime: HydratedDocument<ShareTime>): MyShareTimeResponse => {
    const shareTimeCopy: PopulatedShareTime = {
      ...shareTime.toObject({
        versionKey: false // Cosmetics; prevents returning of __v property
      })
    };
  
    const {username} = shareTimeCopy.authorId;
    delete shareTimeCopy.authorId;
  
    return {
      _id: shareTimeCopy._id.toString(),
      author: username,
      lastWeekly: shareTimeCopy.lastWeekly.toString(),
      currentDaily: shareTimeCopy.currentDaily.toString(),
      currentWeekly: shareTimeCopy.currentWeekly.toString(),
      currentWeekday: shareTimeCopy.currentWeekday.toString(),
      trend: (shareTimeCopy.trend == -1 ) ? "decreasing" : (shareTimeCopy.trend == 1) ? "increasing" : "stable",
    };
  };

export {
  constructShareTimeResponse,
  constructMyShareTimeResponse
};