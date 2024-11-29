/** import packages [start] */
import pg from 'pg';
/** import packages [end] */

export interface QueryFunction {
    (pgClient: pg.PoolClient, ...args: any[]): Promise<void>;
}
