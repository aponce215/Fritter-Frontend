import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Freet on the backend
export type Benevolence = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  nominations: Number;
  reports: Number;
  granted: Boolean;
  myVotes: [Types.ObjectId, Types.ObjectId, Types.ObjectId];
  myReports: Types.ObjectId[];
};

export type PopulatedBenevolence = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  nominations: Number;
  reports: Number;
  granted: Boolean;
  myVotes: [User, User, User];
  myReports: User[];
};

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const BenevolenceSchema = new Schema<Benevolence>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The number of nominations a user has received
  nominations: {
    type: Number,
    required: true
  },
  // The number of nominations a user has received
  reports: {
    type: Number,
    required: true
  },
  // The number of nominations a user has received
  granted: {
    type: Boolean,
    required: true
  },
  myVotes: {
    type: [Schema.Types.ObjectId, Schema.Types.ObjectId, Schema.Types.ObjectId],
    required: true,
    ref: 'User'
  },
  myReports: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: 'User'
  },
});

const BenevolenceModel = model<Benevolence>('Benevolence', BenevolenceSchema);
export default BenevolenceModel;
