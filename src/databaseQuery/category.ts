/** import packages [start] */
import { PoolClient } from "pg";
/** import packages [end] */

/** import prerequisites [start] */
import dbQuery, { dbQueryByClient, transaction } from "../modules/database";
import Logger from "../utils/logger";
import { DBCategory, DbInsertCategory, DbUpdateCategory, FetchCategroyFilter } from "./types";
/** import prerequisites [end] */

/** Logger initialization [start] */
const log = Logger('databaseQuery/category.ts');
/** Logger initialization [end] */


export const insertCategory = async (category: DbInsertCategory): Promise<DBCategory> => {
    try {
        const fields = ['name'];
        const values = ['$1'];
        const params = [category.name];

        const query = `INSERT INTO category (${fields.join(',')}) VALUES(${values.join(',')}) RETURNING *`;

        const newCategory = (await dbQuery(query, params)).rows[0];
        return newCategory;
    } catch (err) {
        log.error('insertCategory() query failed:', err);
        throw err;
    }
}

export const fetchCategory = async (filterBy: FetchCategroyFilter) => {
    try {
        const filters = [];
        const params = [];

        if (filterBy.id) {
            params.push(filterBy.id);
            filters.push(`id=$${params.length}`);
        }
        if (filterBy.name) {
            params.push(filterBy.name);
            filters.push(`name=$${params.length}`);
        }
        if (filterBy.in_store !== undefined) {
            params.push(filterBy.in_store);
            filters.push(`in_store=$${params.length}`);
        }

        const whereCon = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

        const query = `SELECT * FROM category ${whereCon}`;
        const categories = (await dbQuery(query, params)).rows as DBCategory[];

        return categories;
    } catch (err) {
        log.error('fetchCategory() query failed:', err);
        throw err;
    }
}

export const deleteCategory = async (category_id: string) => {
    try {
        const query = 'DELETE FROM category WHERE id=$1';
        const params = [category_id];
        await transaction(async (client: PoolClient) => {
            await dbQueryByClient(client, query, params);
        })
    } catch (err) {
        log.error('deleteCategory() query failed:', err);
        throw err;
    }
}

export const updateCategoryData = async (category_id: string, updateFields: DbUpdateCategory): Promise<DBCategory | undefined> => {
    try {
        const fields = [];
        const params: (string | boolean)[] = [];

        if (updateFields.name) {
            params.push(updateFields.name);
            fields.push(`name=$${params.length}`);
        }
        if (updateFields.in_store !== undefined) {
            params.push(updateFields.in_store);
            fields.push(`in_store=$${params.length}`);
        }

        params.push(category_id);

        if (fields.length == 0) return;

        const query = `UPDATE category SET ${fields.join(',')} WHERE id=$${params.length} RETURNING *`;
        let updatedCategory = undefined;

        await transaction(async (client: PoolClient) => {
            updatedCategory = (await dbQueryByClient(client, query, params)).rows[0];
        });

        return updatedCategory;
    } catch (err) {
        log.error('updateCategory() query failed:', err);
        throw err;
    }
}