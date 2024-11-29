/** import packages [start] */
import { Server } from 'http'
import path from 'path';
import config from 'config';
import express, { Response, Request, NextFunction } from 'express';
import cors from 'cors';
/** import packages [end] */

/** import prerequisites [start] */
import Logger from '../utils/logger'
import CustomError from '../modules/error';
import { StatusCode } from '../types';
import { handleErrorResponse } from '../modules/server';
import apiRouter from './apis';
import { deleteFile } from '../utils/helper';
/** import prerequisites [end] */

/** Logger initialization [start] */
const log = Logger('externalServer/apis/v1/index.ts');
/** Logger initialization [end] */

const name = 'ExternalServer';
const port = config.get<string>(`${name}.port`)
let server: Server;

export const initExternalServer = () => {
    const app = express();
    // Middlewares
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(express.static(config.get<string>(`${name}.publicFolderPath`)));

    // Routes
    app.use(apiRouter);

    // Api Not Found
    app.use('/', (req, _, next) => {
        return next(new CustomError(`${req.originalUrl} route not found!`, StatusCode.NOT_FOUND));
    });

    // Error Handling
    app.use((err: any, req: Request, res: Response, _: NextFunction) => {
        if (req.file)
            deleteFile(req.file.path);
        handleErrorResponse(res, err);
    });

    // initiate external server
    server = app.listen(port, () => {
        log.info(`${name} listening at port:${port}`);
    })
}

export const closeExternalServer = () => {
    server.close((error) => {
        log.error(`${name} close at port:${port}`, error);
    })
}