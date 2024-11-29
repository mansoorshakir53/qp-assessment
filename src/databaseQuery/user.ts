/** import prerequisites [start] */
import dbQuery from "../modules/database";
import Logger from "../utils/logger";
import { DBInsertUser, DBUser, FetchUserFilter } from "./types";
/** import prerequisites [end] */

/** Logger initialization [start] */
const log = Logger('databaseQuery/user.ts');
/** Logger initialization [end] */


export const insertUser = async (user: DBInsertUser) => {
    try {
        const fields = ['first_name', 'last_name', 'email', 'salt', 'hash'];
        const values = ['$1', '$2', '$3', '$4', '$5'];
        const params = [user.first_name, user.last_name, user.email, user.salt, user.hash];

        if (user.role) {
            fields.push('role');
            values.push('$6');
            params.push(user.role);
        }

        const query = `INSERT INTO users (${fields.join(',')}) VALUES(${values.join(',')})`;

        await dbQuery(query, params);
    } catch (err) {
        log.error('insertUser() query failed:', err);
        throw err;
    }
}

export const fetchUser = async (filterBy: FetchUserFilter): Promise<DBUser[]> => {
    try {
        const filters = [];
        const params = [];

        if (filterBy.id) {
            params.push(filterBy.id);
            filters.push(`id=$${params.length}`);
        }
        if (filterBy.email) {
            params.push(filterBy.email);
            filters.push(`email=$${params.length}`);
        }
        if (filterBy.role) {
            params.push(filterBy.role);
            filters.push(`role=$${params.length}`);
        }
        if (filterBy.is_block !== undefined) {
            params.push(filterBy.is_block);
            filters.push(`is_block=$${params.length}`);
        }

        const whereCon = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

        const query = `SELECT * FROM users ${whereCon}`;
        const users = (await dbQuery(query, params)).rows as DBUser[];

        return users;
    } catch (err) {
        log.error('fetchUser() query failed:', err);
        throw err;
    }
}