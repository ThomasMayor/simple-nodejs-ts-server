
import * as mongoose from 'mongoose';
// Import MongoDB config
import { DB_HOST, DB_NAME } from "./config";
declare var process:any;
// Define MongoDB path url
const MONGODB_URI:string = process.env.MONGODB_URI || `${DB_HOST}/${DB_NAME}`;


export class DataBase{

  constructor(){
  } 

  static connect(){
    // connect to database
    return new Promise((resolve,reject)=>{
			// Connect to MongoDB with Mongoose
			console.log('MONGODB_URI=',MONGODB_URI);
			mongoose.connect(MONGODB_URI, <any>{
					useMongoClient: true
				}, (err) => {
					if (err) { reject("Error connecting to MongoDB!")}
				  else{  resolve("MongoDB Ready!"); }
			});
	  })
  }
}
