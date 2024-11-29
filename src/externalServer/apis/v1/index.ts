/** import packages [start] */
import { Router } from 'express';
/** import packages [end] */

/** import prerequisites [start] */
import userRouter from './user';
import categoryRouter from './category';
import groceryRouter from './grocery';
/** import prerequisites [end] */

const v1Router = Router();

v1Router.use('/v1', [
    userRouter,
    categoryRouter,
    groceryRouter,
]);


export default v1Router;


