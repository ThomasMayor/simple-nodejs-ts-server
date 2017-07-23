import * as express from 'express';
import * as http  from "http";
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as morgan from 'morgan';

import { ServerRoutes }  from "./routes/serverRoute";
import { APIRoutes }  from "./routes/apiRoute";
import { DataBase }  from "./database";
import { log }  from "./log";
// Import secretTokenKey config

import { SECRET_TOKEN_KEY } from "./config";
import { userController } from './models/users/users.controller';

import * as passport from "passport";
import { ExtractJwt, Strategy as StrategyJwt, StrategyOptions as StrategyOptionsJwt} from "passport-jwt";

declare var process:any;

export class Server {

  public app:express.Application;
  private server:http.Server;
  private root:string;
  private port:number|string|boolean;


  constructor() {
    this.app = express();
  }
  public initServer():void {
    this.server = http.createServer(this.app);
  }

  public init():any {
    this.config();
    this.middleware();
    return this.dbConnect();
  }

  private config():void {
    this.port = this.normalizePort(process.env.PORT || 8080);
  }

  private middleware() {
    //Authorization middleware
    let options: StrategyOptionsJwt = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
      secretOrKey: SECRET_TOKEN_KEY,
      passReqToCallback: true,
    };
    this.app.use(passport.initialize());
    passport.use(new StrategyJwt(options, userController.checkJWT));

    //Other middleware
    this.app
      // use bodyParser middleware to decode json parameters
      .use(bodyParser.json())
      .use(bodyParser.json({type: 'application/vnd.api+json'}))
      // use bodyParser middleware to decode urlencoded parameters
      .use(bodyParser.urlencoded({extended: false}))
      // secret variable for jwt
      .set('superSecret', SECRET_TOKEN_KEY)
      // cors domaine origin
      .use(cors())

    // use morgan to log requests to the console
    if (process.env.NODE_ENV != "test")
      this.app.use(morgan('dev'))
  }

  private dbConnect() {
    // Load DB connection
    return DataBase.connect()
      .then(result => {
        // Load all route
        console.log(result)
        // Server Endpoints
        this.app.use( new ServerRoutes().routes());
        // REST API Endpoints
        this.app.use( new APIRoutes().routes());
      })
      .catch(error => {
        // DB connection Error => load only server route
        console.log(error)
        // Server Endpoints
        this.app.use(new ServerRoutes().routes());
        return error
      })
      .then(error => {
        // Then catch 404 & db error connection
        this.app.use((req, res)=>{
          console.log(error)
          let message:any[] = (error)? [{error: 'Page not found'}, {error}] : [{error: 'Page not found'}]
          res.status(404).json(message);
        })
      })
  }

  private onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') throw error;
    let bind:string = (typeof this.port === 'string') ? 'Pipe ' + this.port : 'Port ' + this.port;
    switch(error.code) {
      case 'EACCES':
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  normalizePort(val: number|string): number|string|boolean {
    let port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(port)) return val;
    else if (port >= 0) return port;
    else return false;
  }

  bootstrap():void{
    this.server.on('error', this.onError);
    this.server.listen(this.port, ()=>{
    	console.log("Listnening on port " + this.port)
    });
  }
}
