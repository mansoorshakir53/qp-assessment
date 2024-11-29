/** import packages [start] */
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';
/** import packages [end] */

/** import prerequisites [start] */
import Logger from '../../utils/logger'
import CustomError from '../../modules/error';
import { StatusCode } from '../../types';
import { handleErrorResponse } from '../../modules/server';
import { TokenPayload } from '../../types';
/** import prerequisites [end] */

/** Logger initialization [start] */
const log = Logger('externalServer/middlewares/auth.ts');
/** Logger initialization [end] */

const checkBearerToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    if (req.body && req.body.headers && req.body.headers.authorization) {
        req.headers.authorization = req.body.headers.authorization;
    }
    if (
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const payload = jwt.verify(token, config.get<string>('JWTSecret')) as TokenPayload;

            if (req.user?.role && req.user.role !== payload.role)
                next(new CustomError('Not Authroized!', StatusCode.UNAUTHORIZED));

            req.user = payload;

            return next();
        } catch (error: any) {
            log.error(error);
            handleErrorResponse(error, res);
        }
    } else {
        next(new CustomError("Authorization Header missing", StatusCode.UNAUTHORIZED),);
    }
};

export default checkBearerToken;
