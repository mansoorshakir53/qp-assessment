/** import packages [start] */
import config from 'config';
import { Pool, PoolClient, QueryResult } from 'pg'
/** import packages [end] */

/** import prerequisites [start] */
import Logger from '../utils/logger';
import { DatabaseConnection, QueryParameters } from '../types';
import { QueryFunction } from '../types/database';
/** import prerequisites [end] */

/** Logger initialization [start] */
const log = Logger('modules/database.ts');
/** Logger initialization [end] */

const databaseConnection = config.get('Database') as DatabaseConnection;
let pool: Pool;

export const initDbConnectionPool = async () => {
    pool = new Pool({
        user: databaseConnection.username,
        database: databaseConnection.name,
        password: databaseConnection.password,
        port: databaseConnection.port,
        host: databaseConnection.host,
    });

    const client = await pool.connect();
    log.info('Connected to postgres database pool.');
    client.release();
}

export const closeDbConnectionPool = async () => {
    if (pool === undefined) log.error('Cannot close as pool does not exist!');
    else {
        log.info('Shuting down database pool...');
        await pool.end();
        log.info('Database pool has been shut down.');
    }
}

const dbQuery = async (
    queryString: string,
    parameters: QueryParameters,
): Promise<QueryResult<any>> => {
    if (pool === undefined) throw new Error('Cannot run the query as pool connection is not initialized.');
    const client = await pool.connect();
    try {
        const queryResult = await client.query(queryString, parameters);
        return queryResult;
    } catch (error) {
        log.error('Failed fetching query result:', error);
        throw error;
    } finally {
        client.release();
    }
}

export const dbQueryByClient = async (
    client: PoolClient,
    queryString: string,
    parameters: QueryParameters,
): Promise<QueryResult<any>> => {
    try {
        const queryResult = await client.query(queryString, parameters);
        return queryResult;
    } catch (error) {
        log.error('Failed fetching query result:', error);
        throw error;
    }
}


export const transaction = async (queryFunction: QueryFunction, ...args: any[]): Promise<void> => {
    if (pool === undefined) throw new Error('Cannot run the transaction as pool connection is not initialized.');
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await queryFunction(client, ...args);
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        log.error('Transaction failed, rolling back.');
        throw error;
    } finally {
        client.release();
    }
}


export default dbQuery;