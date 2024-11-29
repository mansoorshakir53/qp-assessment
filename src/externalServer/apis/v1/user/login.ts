/** import packages [start] */
import crypto from 'crypto';
import { NextFunction, Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';
/** import packages [end] */

/** import prerequisites [start] */
import { handleSuccessResponse } from '../../../../modules/server';
import validate from '../../../middlewares/validate';
import { loginUserSchema } from '../../../validations/user';
import { LoginUserDetails } from './types';
import Logger from "../../../../utils/logger";
import { fetchUser } from '../../../../databaseQuery/user';
import CustomError from '../../../../modules/error';
import { StatusCode } from '../../../../types';
/** import prerequisites [end] */

/** Logger initialization [start] */
const log = Logger('externalServer/apis/v1/user/login.ts');
/** Logger initialization [end] */

const loginUser = (route: Router) => {
    return route.post('/login', [
        validate(loginUserSchema, 'body'),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const bodyPayload = req.body as LoginUserDetails;

                const user = (await fetchUser({
                    email: bodyPayload.email,
                }))[0];

                if (!user)
                    throw new CustomError('Email not registered', StatusCode.BAD_REQUEST);

                const inputPasswordHash = crypto.pbkdf2Sync(bodyPayload.password, user.salt, 10000, 64, 'sha512').toString('hex');
                if (user.hash !== inputPasswordHash)
                    throw new CustomError('Password is incorrect', StatusCode.BAD_REQUEST);

                const token = jwt.sign({
                    id: user.id,
                    email: user.email,
                    role: user.role
                }, config.get<string>('JWTSecret'));

                handleSuccessResponse(res, {
                    message: 'Signin Successfully',
                    data: {
                        token,
                    }
                })
            } catch (err) {
                log.error('loginUser() api failed:', err);
                next(err);
            }
        }])
}

export default loginUser;