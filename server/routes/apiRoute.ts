import * as express from 'express';
import { UsersRoutes }  from "./api/users/users.routes";
import { ReportsRoutes }  from "./api/reports/reports.routes";

const app = express();

export class APIRoutes {

    routes() {
        app.use("/api/users", new UsersRoutes().routes());
        app.use("/api/reports", new ReportsRoutes().routes());
        return app;
    }

}
