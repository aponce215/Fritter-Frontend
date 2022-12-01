import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Profile, PopulatedProfile} from '../profile/model';

type ProfileResponse = {
  _id: string;
  author: string;
  description: string;
  displayName: string;
  birthday: string;
};


/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw profile object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Freet>} profile - A profile
 * @returns {ProfileResponse} - The freet object formatted for the frontend
 */
const constructProfileResponse = (profile: HydratedDocument<Profile>): ProfileResponse => {
  const profileCopy: PopulatedProfile = {
    ...profile.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  const {username} = profileCopy.authorId;

  delete profileCopy.authorId;
  if (!profileCopy.showBirthday){
    profileCopy.birthday = "";
  }
  delete profileCopy.showBirthday;

  return {
    ...profileCopy,
    _id: profileCopy._id.toString(),
    author: username,
  };
};

/**
 * Transform a raw profile object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Freet>} profile - A profile
 * @returns {ProfileResponse} - The freet object formatted for the frontend
 */
 const constructMyProfileResponse = (profile: HydratedDocument<Profile>): ProfileResponse => {
    const profileCopy: PopulatedProfile = {
      ...profile.toObject({
        versionKey: false // Cosmetics; prevents returning of __v property
      })
    };
  
    const {username} = profileCopy.authorId;
  
    delete profileCopy.authorId;
  
    return {
      ...profileCopy,
      _id: profileCopy._id.toString(),
      author: username,
    };
  };

export {
  constructProfileResponse,
  constructMyProfileResponse
};
