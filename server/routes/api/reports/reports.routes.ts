import * as express from 'express';
import { reportController }  from "../../../models/reports/reports.controller";
import { log } from '../../../log';
import * as passport from "passport";

const router:any = express.Router();

export class ReportsRoutes {


    routes() {
        // Public Endpoints:
        router.post('/', passport.authenticate('jwt', {session: false}), log, reportController.insert)
        router.get('/', passport.authenticate('jwt', {session: false}), log, reportController.getAll)
        /*router.post('/signup', log, reportController.signup)

        // Privates Endpoints
        router.param('uid', reportController.checkUID);

        router.get('/isauth', passport.authenticate('jwt', {session: false}), log, reportController.isAuth)
        router.get('/users', passport.authenticate('jwt', {session: false}), log, reportController.getAll)
        router.get('/users/:id', passport.authenticate('jwt', {session: false}), log, reportController.getUser)
*/
        // then return the user router
        return router;
    }

}
