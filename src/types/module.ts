/** import packages [start] */
import { MulterError } from 'multer';
import { ValidationError } from 'joi';
/** import packages [end] */

/** import prerequisites [start] */
import CustomError from '../modules/error';
/** import prerequisites [end] */


export type DatabaseConnection = {
    host: string;
    port: number;
    username: string;
    password: string;
    name: string;
};

export type QueryParameters = (null | string | string[] | number | Date | JSON | Boolean)[];

export enum StatusCode {
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
    SERVER_ERROR = 500,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
}

export const ErrorTypes = {
    CUSTOM: { instance: CustomError, name: 'CustomError' },
    MULTER: { instance: MulterError, name: 'MulterError' },
    VALIDATION: { instance: ValidationError, name: 'ValidationError' },
    INTERNAL: { instance: Error, name: 'InternalError' },
}