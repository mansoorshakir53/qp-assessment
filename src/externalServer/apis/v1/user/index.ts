/** import packages [start] */
import { Router } from 'express';
/** import packages [end] */

/** import prerequisites [start] */
import loginUser from './login';
import regitserUser from './register';
/** import prerequisites [end] */

const userRouter = Router();

userRouter.use('/user', [
    regitserUser(userRouter),
    loginUser(userRouter),
]);


export default userRouter;


