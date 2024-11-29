/** import packages [start] */
import crypto from 'crypto';
import { NextFunction, Request, Response, Router } from 'express';
/** import packages [end] */

/** import prerequisites [start] */
import { handleSuccessResponse } from '../../../../modules/server';
import Logger from "../../../../utils/logger";
import validate from '../../../middlewares/validate';
import { registerUserSchema } from '../../../validations/user';
import { RegisterUserDetails } from './types';
import { fetchUser, insertUser } from '../../../../databaseQuery/user';
import CustomError from '../../../../modules/error';
import { StatusCode } from '../../../../types';
/** import prerequisites [end] */


/** Logger initialization [start] */
const log = Logger('externalServer/apis/v1/user/register.ts');
/** Logger initialization [end] */

const regitserUser = (route: Router) => {
    return route.post('/register', [
        validate(registerUserSchema, 'body'),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const bodyPayload = req.body as RegisterUserDetails;

                const user = (await fetchUser({ email: bodyPayload.email }))[0];

                if (user)
                    throw new CustomError('Email already registered,Please login!', StatusCode.BAD_REQUEST);

                const salt = crypto.randomBytes(32).toString('hex')
                const hash = crypto.pbkdf2Sync(bodyPayload.password, salt, 10000, 64, 'sha512').toString('hex');

                await insertUser({
                    first_name: bodyPayload.firstName,
                    last_name: bodyPayload.lastName,
                    email: bodyPayload.email,
                    salt,
                    hash,
                    role: bodyPayload.role,
                })

                handleSuccessResponse(res, {
                    message: 'Register Successfully',
                    status: StatusCode.CREATED,
                })

            } catch (err) {
                log.error('regitserUser() api failed:', err);
                next(err);
            }
        }])
}

export default regitserUser;