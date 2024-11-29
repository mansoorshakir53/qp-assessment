/** import packages [start] */
import { Response } from 'express';
/** import packages [end] */

/** import prerequisites [start] */
import { ErrorTypes, StatusCode } from '../types';
/** import prerequisites [end] */

export const handleSuccessResponse = (res: Response, obj: { message?: string, data?: unknown, status?: StatusCode }) => {
    return res.status(obj.status ?? StatusCode.OK).json({
        message: obj.message,
        data: obj.data,
    })
}

export const handleErrorResponse = (res: Response, error: any) => {
    if (error instanceof ErrorTypes.CUSTOM.instance) return res.status(error.status).json({ name: ErrorTypes.CUSTOM.name, error: error.message });
    if (error instanceof ErrorTypes.MULTER.instance) return res.status(StatusCode.BAD_REQUEST).json({ name: ErrorTypes.MULTER.name, error: error });
    if (error instanceof ErrorTypes.VALIDATION.instance) return res.status(StatusCode.BAD_REQUEST).json({ name: ErrorTypes.VALIDATION.name, error: error });
    return res.status(StatusCode.SERVER_ERROR).json({ name: ErrorTypes.INTERNAL.name, error: error.message });
}