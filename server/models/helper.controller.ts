
import * as mongoose from 'mongoose';


export const helperController = {
  handleError : (req:any,res:any, err:any, status: number = 200) =>{
    res.status(status).json({success: false, message: err});
  },

  toObjectId : (_id: string): mongoose.Types.ObjectId =>{
      return mongoose.Types.ObjectId.createFromHexString(_id);
  },
}
