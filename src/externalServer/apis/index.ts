/** import packages [start] */
import { Router } from 'express';
/** import packages [end] */

/** import prerequisites [start] */
import v1Router from './v1';
/** import prerequisites [end] */

const apiRouter = Router();

apiRouter.use('/api', [
    v1Router,
]);


export default apiRouter;


