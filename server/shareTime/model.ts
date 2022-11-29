import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Profile
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Profile on the backend
export type ShareTime = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  lastLogin: Date;
  currentDaily: Number;
  currentWeekly: [Number, Number, Number, Number, Number, Number, Number];
  currentWeekday: Number;
  lastWeekly: Number;
  trend: Number;
};

export type PopulatedShareTime = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  lastLogin: Date;
  currentDaily: Number;
  currentWeekly: [Number, Number, Number, Number, Number, Number, Number];
  lastWeekly: Number;
  currentWeekday: Number;
  trend: Number;
};

// Mongoose schema definition for interfacing with a MongoDB table
// ShareTime stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const ShareTimeSchema = new Schema<ShareTime>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The description of a profile
  lastLogin: {
    type: Date,
    required: true
  },
  // The display name of a profile
  currentDaily: {
    type: Number,
    required: true
  },
  currentWeekly: {
    type: [Number, Number, Number, Number, Number, Number, Number],
    required: true
  },
  currentWeekday: {
    type: Number,
    required: true
  },
  lastWeekly: {
    type: Number,
    required: true
  },
  trend: {
    type: Number,
    required: true
  }
  
});

const ShareTimeModel = model<ShareTime>('ShareTime', ShareTimeSchema);
export default ShareTimeModel;