import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Benevolence} from '../benevolence/model';
import type {ShareTime} from '../shareTime/model';


/**
 * This file defines the properties stored in a Profile
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Profile on the backend
export type Profile = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  description: string;
  displayName: string;
  birthday: string;
  showBirthday: Boolean;
};

export type PopulatedProfile = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  description: string;
  displayName: string;
  birthday: string;
  showBirthday: Boolean;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Profiles stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const ProfileSchema = new Schema<Profile>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The description of a profile
  description: {
    type: String,
    required: true
  },
  // The display name of a profile
  displayName: {
    type: String,
    required: true
  },
  birthday: {
    type: String,
    required: true
  },
  showBirthday: {
    type: Boolean,
    required: true
  }
});

const ProfileModel = model<Profile>('Profile', ProfileSchema);
export default ProfileModel;