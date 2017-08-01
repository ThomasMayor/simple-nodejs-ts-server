import * as express from 'express';
import { reportController }  from "../../../models/reports/reports.controller";
import { userController }  from "../../../models/users/users.controller";
import { log } from '../../../log';
import * as passport from "passport";

const router:any = express.Router();

export class ReportsRoutes {


    routes() {
        // Private Endpoints:
        router.post('/', passport.authenticate('jwt', {session: false}), log, reportController.insert)
        router.get('/', passport.authenticate('jwt', {session: false}), log, reportController.getAll)

        router.param('uid', userController.checkUID)

        router.get('/byuser/:uid', passport.authenticate('jwt', {session: false}), log, reportController.getAllByUserId)

        router.param('rid', reportController.checkRID);

        router.post('/:rid/approve', passport.authenticate('jwt', {session: false}), log, reportController.approve)
        router.post('/:rid/disapprove', passport.authenticate('jwt', {session: false}), log, reportController.disapprove)

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
