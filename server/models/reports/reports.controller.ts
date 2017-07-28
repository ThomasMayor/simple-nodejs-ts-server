import * as mongoose from 'mongoose';

import { Report, IReportModel } from './report.model';
import { userController } from '../users/user.controller';


const toObjectId = (_id: string): mongoose.Types.ObjectId =>{
    return mongoose.Types.ObjectId.createFromHexString(_id);
}

export const reportController = {
  insert : (req:any,res:any) => {
    var report = <IReportModel>new Report(req.body);
    report.created = new Date();
    console.log(report);
    report.user_id = req.authUser._id;
    report.save((err, doc:IReportModel) => {
      if(err) {
        console.log('save report mokup-> ',err)
        res.json({ success: false, message: 'Error with save report' });
        return;
      };
      console.log('Report saved successfully');
      res.json({ success: true, report: doc.toJSON() });
    })
  },

  getAll : (req:any,res:any) => {
		Report.find((err, docs:IReportModel[]) => {
			if(err) return console.log(err);
      let docsReady = docs.map((report)=> report.toJSON());
			res.json(docsReady);
		})
  },

  loadUser : (report: IReportModel):IReportModel => {
    
  }

}
