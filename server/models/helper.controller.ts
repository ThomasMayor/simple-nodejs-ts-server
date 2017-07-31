
import * as mongoose from 'mongoose';


export const helperController = {
  handleError : (req:any,res:any, err:any) =>{
    res.json({success: false, message: err});
  },

  toObjectId : (_id: string): mongoose.Types.ObjectId =>{
      return mongoose.Types.ObjectId.createFromHexString(_id);
  },
}
