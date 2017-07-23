import * as express from 'express';
import { UsersRoutes }  from "./api/users/users.routes";

const app = express();

export class APIRoutes {

    routes() {
        app.use("/", new UsersRoutes().routes());
        return app;
    }

}
