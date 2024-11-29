/** import packages [start] */
import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'joi';
/** import packages [end] */

/** import prerequisites [start] */
import CustomError from '../../modules/error';
import { StatusCode } from '../../types';
/** import prerequisites [end] */

/**
 * Middleware to check and validate request body/query/params.
 * @param schema validation schema
 * @param reqProperty 'body' | 'query' | 'params' = 'body'
 */

const validate = (schema: ObjectSchema, reqProperty: 'body' | 'query' | 'params' | 'all' = 'body') => {
    if (!schema) {
        throw new CustomError(`'${schema}' does not exist`, StatusCode.BAD_REQUEST);
    }

    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const dataToVerify = reqProperty === 'all' ? req : req[reqProperty];
            await schema.validateAsync(dataToVerify, {
                abortEarly: true,
                stripUnknown: true,
                allowUnknown: false,
                convert: false,
            });
            next();
        } catch (error: any) {
            next(error);
        }
    };
};

export default validate;
