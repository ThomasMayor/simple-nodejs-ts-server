import * as mongoose from 'mongoose';

import { Report, IReportModel } from './report.model';
import { User } from '../users/user.model';
import { helperController } from '../helper.controller';


export const reportController = {
  insert : (req:any,res:any) => {
    var report = <IReportModel>new Report(req.body);
    if (!report.created)
      report.created = new Date();
    console.log(report);
    report._creator = req.authUser._id;
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
		Report.find()
          .populate('_creator')
          .exec((err, docs:IReportModel[])=> {
			if(err) return console.log(err);
      let docsReady = docs.map((report) => report.toJSON());
			res.json(docsReady);
		})
  },

  getAllByUserId : (req:any, res:any) => {
    Report.find({ _creator: req.user._id })
          .populate('_creator')
          .exec((err, docs:IReportModel[])=> {
      if(err) return console.log(err);
      let docsReady = docs.map((report) => report.toJSON());
      res.json(docsReady);
    })
  },

  approve : (req:any, res:any) => {
    let report: any = req.report; //declare as any to avoid TS2339 error
    if (report.approved.findIndex((id:any) => id.toString() == req.authUser._id) == -1 &&
        report.disapproved.findIndex((id:any) => id.toString() == req.authUser._id) == -1) {
      report.approved.push(req.authUser._id);
      report.save()
            .then((newreport:IReportModel) => res.send({ success: true, report: newreport }))
            .catch((err:any) => helperController.handleError(req, res, err));
    }
    else
      helperController.handleError(req, res, 'Constat déjà évalué');
  },

  disapprove : (req:any, res:any) => {
    let report: any = req.report; //declare as any to avoid TS2339 error
    if (report.approved.findIndex((id:any) => id.toString() == req.authUser._id) == -1 &&
        report.disapproved.findIndex((id:any) => id.toString() == req.authUser._id) == -1) {
      report.disapproved.push(req.authUser._id);
      report.save()
            .then((newreport:IReportModel) => res.send({ success: true, report: newreport }))
            .catch((err:any) => helperController.handleError(req, res, err));
    }
    else
      helperController.handleError(req, res, 'Constat déjà évalué');
  },

  checkRID: (req:any, res:any, next:any, rid:any) => {
    Report.findById(helperController.toObjectId(rid)).then(report => {
        if (!report) {
            return res.status(404 /* Not Found */).send();
        } else {
            //add report to request
            req.report = report;
            return next();
        }
    }).catch(next);
  }

}
