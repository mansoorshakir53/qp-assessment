/** import packages [start] */
import dotenv from 'dotenv';
/** import packages [end] */

/** load env variables */
dotenv.config();

/** import prerequisites [start] */
import Logger from './utils/logger'
import { initExternalServer, closeExternalServer } from './externalServer';
import { closeDbConnectionPool, initDbConnectionPool } from './modules/database';
/** import prerequisites [end] */


/** Logger initialization [start] */
const log = Logger('index.ts');
/** Logger initialization [end] */

const gracefulShutdown = async (): Promise<void> => {
    // Close internal server
    closeExternalServer();

    // Close db pool
    await closeDbConnectionPool();

    process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);

const bootUp = async () => {
    try {
        // Connect to postgres database
        await initDbConnectionPool();

        // Initialize External Server
        initExternalServer();
    } catch (e) {
        log.error('App shutdown due to:- ', e);
        await gracefulShutdown();
    }
};

bootUp();
