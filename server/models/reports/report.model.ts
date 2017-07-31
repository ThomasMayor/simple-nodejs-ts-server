import * as mongoose from 'mongoose';
// Import Schemas
import { ReportSchema } from './report.schema';
import { IUserModel } from '../users/user.model';

export interface IReportModel extends mongoose.Document {
  title: string;
  description: string;
  pictures: string[];
  approved: Array<mongoose.Schema.Types.ObjectId>;
  disapproved: Array<mongoose.Schema.Types.ObjectId>;
  created: Date;
  _creator: mongoose.Schema.Types.ObjectId;
  latitude: number;
  longitude: number;
  place: string;
}

// Define & export Mongoose Model with Interface
export const Report:mongoose.Model<IReportModel>  = mongoose.model<IReportModel>('reports', ReportSchema);
