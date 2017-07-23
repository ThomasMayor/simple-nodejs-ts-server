import * as express from 'express';
import { log } from '../log';


const app = express();

export class ServerRoutes {

    routes() {
      // Index Server
     app.get('/', log, (req, res)=>{
        res.status(200);
        res.json({api: 'Hello!'});
       });
      return app;
    }
}
