import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Benevolence, PopulatedBenevolence} from '../benevolence/model';

// export type Benevolence = {
//     _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
//     authorId: Types.ObjectId;
//     nominations: Number;
//     reports: Number;
//     granted: Boolean;
//     myVotes: [Types.ObjectId, Types.ObjectId, Types.ObjectId];
//     myReports: Types.ObjectId[];
// };

type GenBenevolenceResponse = {
    _id: string;
    author: string;
    granted: string;
};

type MyBenevolenceResponse = {
  _id: string;
  author: string;
  granted: string;
  myVotes: string;
  myReports: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Freet>} benevolence - A freet
 * @returns {BenevolenceResponse} - The freet object formatted for the frontend
 */
const constructGenBenevolenceResponse = (benevolence: HydratedDocument<Benevolence>): GenBenevolenceResponse => {
  const benevolenceCopy: PopulatedBenevolence = {
    ...benevolence.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = benevolenceCopy.authorId;
  delete benevolenceCopy.authorId;
  return {
    _id: benevolenceCopy._id.toString(),
    author: username,
    granted: benevolenceCopy.granted.toString(),
  };
};

/**
 * Transform a raw benevolence object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Freet>} benevolence - A benevolence
 * @returns {BenevolenceResponse} - The benevolence object formatted for the frontend
 */

const constructMyBenevolenceResponse = (benevolence: HydratedDocument<Benevolence>): MyBenevolenceResponse => {
    const benevolenceCopy: PopulatedBenevolence = {
        ...benevolence.toObject({
        versionKey: false // Cosmetics; prevents returning of __v property
        })
    };
    const {username} = benevolenceCopy.authorId;
    delete benevolenceCopy.authorId;
    return {
        _id: benevolenceCopy._id.toString(),
        author: username,
        granted: benevolenceCopy.granted.toString(),
        myVotes: benevolenceCopy.myVotes.map(person => person.username).toString(),
        myReports: benevolenceCopy.myReports.map(person => person.username).toString()
    };
};
export {
  constructGenBenevolenceResponse,
  constructMyBenevolenceResponse
};
