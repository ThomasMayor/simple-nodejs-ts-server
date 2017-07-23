import * as express from 'express';
import { userController }  from "../../../models/users/users.controller";
import { log } from '../../../log';
import * as passport from "passport";

const router:any = express.Router();

export class UsersRoutes {


    routes() {
        // Public Endpoints:
        router.get('/setup', log, userController.setup)
        router.post('/auth', log, userController.auth)
        router.post('/signup', log, userController.signup)

        // Privates Endpoints
        router.param('uid', userController.checkUID);

        router.get('/isauth', passport.authenticate('jwt', {session: false}), log, userController.isAuth)
        router.get('/users', passport.authenticate('jwt', {session: false}), log, userController.getAll)
        router.get('/users/:id', passport.authenticate('jwt', {session: false}), log, userController.getUser)

        // then return the user router
        return router;
    }

}
