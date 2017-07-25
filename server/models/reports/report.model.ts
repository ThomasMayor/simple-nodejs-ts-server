import * as mongoose from 'mongoose';
// Import Schemas
import { ReportSchema } from './report.schema';

export interface IReportModel extends mongoose.Document {
  title: string;
  description: string;
  pictures: string[];
  approved: mongoose.Schema.Types.ObjectId[];
  disapproved: mongoose.Schema.Types.ObjectId[];
  created: Date;
  user_id: mongoose.Schema.Types.ObjectId;
  latitude: number;
  longitude: number;
}

// Define & export Mongoose Model with Interface
export const Report:mongoose.Model<IReportModel>  = mongoose.model<IReportModel>('reports', ReportSchema);
