import * as mongoose from 'mongoose';
// Import Schemas
import { UserSchema } from './user.schema';

export interface IUserModel extends mongoose.Document {
  password: string,
  email:string,
  admin: boolean,
  name: string,
  created: Date,
  verified: boolean,
  profilePicture: string,
  approvals: number,
  disapprovals: number,
  reports: number,
  lastReport: Date,
}

// Define & export Mongoose Model with Interface
export const User:mongoose.Model<IUserModel>  = mongoose.model<IUserModel>('users', UserSchema);
