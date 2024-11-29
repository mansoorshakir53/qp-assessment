/** import packages [start] */
import { PoolClient } from "pg";
/** import packages [end] */

/** import prerequisites [start] */
import dbQuery, { dbQueryByClient, transaction } from "../modules/database";
import Logger from "../utils/logger";
import { DBInsertItem, DbInsertOderItem, DbInsertOrder, DbInsertUserOrder, DBItem, DBOrder, DBOrderItem, DbUpdateItem, DBUserOrder, FetchItemFilter, FetchOrderFilter } from "./types";
/** import prerequisites [end] */

/** Logger initialization [start] */
const log = Logger('databaseQuery/grocery.ts');
/** Logger initialization [end] */


export const insertGrocery = async (item: DBInsertItem): Promise<DBItem> => {
    try {
        const fields = ['name', 'description', 'inventory_level', 'category_id', 'price', 'stock', 'unit'];
        const values = ['$1', '$2', '$3', '$4', '$5', '$6', '$7'];
        const params = [item.name, item.description, item.inventory_level, item.category_id, item.price, item.stock, item.unit];

        if (item.image_url) {
            fields.push('image_url');
            values.push(`$${fields.length}`);
            params.push(item.image_url);
        }
        if (item.image_path) {
            fields.push('image_path');
            values.push(`$${fields.length}`);
            params.push(item.image_path);
        }
        if (item.expired_at) {
            fields.push('expired_at');
            values.push(`to_timestamp($${fields.length})`);
            params.push(item.expired_at as number);
        }

        const query = `INSERT INTO items (${fields.join(',')}) VALUES(${values.join(',')}) RETURNING *`;

        const newItem = (await dbQuery(query, params)).rows[0];
        return newItem;
    } catch (err) {
        log.error('insertGrocery() query failed:', err);
        throw err;
    }
}

export const fetchGrocery = async (filterBy: FetchItemFilter) => {
    try {
        const filters = [];
        const params = [];

        if (filterBy.id) {
            params.push(filterBy.id);
            filters.push(`id=$${params.length}`);
        }
        if (filterBy.inventory_level) {
            params.push(filterBy.inventory_level);
            filters.push(`inventory_level=$${params.length}`);
        }
        if (filterBy.category_id) {
            params.push(filterBy.category_id);
            filters.push(`category_id=$${params.length}`);
        }
        if (filterBy.unit) {
            params.push(filterBy.unit);
            filters.push(`unit=$${params.length}`);
        }
        if (filterBy.price) {
            params.push(filterBy.price);
            filters.push(`price>=$${params.length}`);
        }
        if (filterBy.in_store !== undefined) {
            params.push(filterBy.in_store);
            filters.push(`in_store=$${params.length}`);
        }
        if (filterBy.in_stock !== undefined) {
            if (filterBy.in_stock) filters.push('stock > 0');
            else filters.push('stock=0');
        }
        if (filterBy.is_expired !== undefined) {
            if (filterBy.is_expired) filters.push('CURRENT_TIMESTAMP > expired_at');
            else filters.push('expired_at IS NULL OR CURRENT_TIMESTAMP <= expired_at');
        }

        const whereCon = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

        const query = `SELECT * FROM items ${whereCon}`;
        const items = (await dbQuery(query, params)).rows as DBItem[];
        return items;
    } catch (err) {
        log.error('fetchGrocery() query failed:', err);
        throw err;
    }
}

export const deleteGrocery = async (item_id: string): Promise<DBItem | undefined> => {
    try {
        const query = 'DELETE FROM items WHERE id=$1 RETURNING *';
        const params = [item_id];
        let deletedItem;

        await transaction(async (client: PoolClient) => {
            deletedItem = (await dbQueryByClient(client, query, params)).rows[0] as DBItem;
        });

        return deletedItem;
    } catch (err) {
        log.error('deleteGrocery() query failed:', err);
        throw err;
    }
}

export const updateGroceryData = async (item_id: string, updateFields: DbUpdateItem): Promise<DBItem | undefined> => {
    try {
        const fields = [];
        const params: (string | boolean | number)[] = [];

        if (updateFields.name) {
            params.push(updateFields.name);
            fields.push(`name=$${params.length}`);
        }
        if (updateFields.description) {
            params.push(updateFields.description);
            fields.push(`description=$${params.length}`);
        }
        if (updateFields.stock !== undefined) {
            params.push(updateFields.stock);
            fields.push(`stock=$${params.length}`);
        }
        if (updateFields.price) {
            params.push(updateFields.price);
            fields.push(`price=$${params.length}`);
        }
        if (updateFields.inventory_level) {
            params.push(updateFields.inventory_level);
            fields.push(`inventory_level=$${params.length}`);
        }
        if (updateFields.category_id) {
            params.push(updateFields.category_id);
            fields.push(`category_id=$${params.length}`);
        }
        if (updateFields.expired_at) {
            params.push(updateFields.expired_at as number);
            fields.push(`expired_at=to_timestamp($${params.length})`);
        }
        if (updateFields.in_store !== undefined) {
            params.push(updateFields.in_store);
            fields.push(`in_store=$${params.length}`);
        }
        if (updateFields.image_url) {
            params.push(updateFields.image_url);
            fields.push(`image_url=$${params.length}`);
        }
        if (updateFields.image_path) {
            params.push(updateFields.image_path);
            fields.push(`image_path=$${params.length}`);
        }

        params.push(item_id);

        if (fields.length == 0) return;

        const query = `UPDATE items SET ${fields.join(',')} WHERE id=$${params.length} RETURNING *`;
        let updatedItem;

        await transaction(async (client: PoolClient) => {
            updatedItem = (await dbQueryByClient(client, query, params)).rows[0];
        });

        return updatedItem;

    } catch (err) {
        log.error('updateGrocery() query failed:', err);
        throw err;
    }
}

export const insertUserOrder = async (userOrder: DbInsertUserOrder, client: PoolClient): Promise<DBUserOrder> => {
    try {
        const fields = ['user_id', 'amount'];
        const values = ['$1', '$2'];
        const params = [userOrder.user_id, userOrder.amount];

        if (userOrder.invoice) {
            fields.push('invoice');
            values.push('$3');
            params.push(userOrder.invoice);
        }

        const query = `INSERT INTO user_orders (${fields.join(',')}) VALUES(${values.join(',')}) RETURNING *`;

        return (await dbQueryByClient(client, query, params)).rows[0] as DBUserOrder;

    } catch (err) {
        log.error('insertUserOrder() query failed:', err);
        throw err;
    }
}

export const insertOrderItems = async (orderItems: DbInsertOderItem, client: PoolClient) => {
    try {
        const fields = ['order_id', 'item_id', 'quantity'];
        let multiValues: string[] = [];
        let params: (string | number)[] = [orderItems.order_id];

        orderItems.items.forEach((item) => {
            params = [...params, item.item_id, item.quantity];
            multiValues = [...multiValues, (`($1,$${params.length - 1},$${params.length})`)];
        })
        const query = `INSERT INTO order_items (${fields.join(',')}) VALUES ${multiValues.join(',')}`;

        await dbQueryByClient(client, query, params);
    } catch (err) {
        log.error('insertOrderItems() query failed:', err);
        throw err;
    }
}


export const insertOrderTx = async (order: DbInsertOrder): Promise<DBUserOrder | undefined> => {
    try {
        let newOrder;
        await transaction(async (client: PoolClient) => {
            newOrder = await insertUserOrder({
                user_id: order.user_id,
                amount: order.amount,
                invoice: order.invoice,
            }, client);

            await insertOrderItems({
                order_id: newOrder.id,
                items: order.items,
            }, client);

            await Promise.all(order.items.map((item) => updateGroceryData(item.item_id, {
                stock: item.stock,
            })))
        });

        return newOrder;
    } catch (err) {
        log.error('insertOrderTx() query failed:', err);
        throw err;
    }
}


export const fetchOrder = async (filterBy: FetchOrderFilter): Promise<DBOrder[]> => {
    try {
        const filters = [];
        const params = [];

        if (filterBy.id) {
            params.push(filterBy.id);
            filters.push(`id=$${params.length}`);
        }
        if (filterBy.user_id) {
            params.push(filterBy.user_id);
            filters.push(`user_id=$${params.length}`);
        }
        if (filterBy.status) {
            params.push(filterBy.status);
            filters.push(`status=$${params.length}`);
        }
        if (filterBy.amount) {
            params.push(filterBy.amount);
            filters.push(`amount>=$${params.length}`);
        }
        const whereCon = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

        const query1 = `SELECT * FROM user_orders  ${whereCon}`;
        const orders = (await dbQuery(query1, params)).rows as DBUserOrder[];

        if (orders.length == 0) return [];

        const query2 = `SELECT * FROM order_items WHERE order_id IN (${orders.map((_, index) => `$${index + 1}`).join(',')})`;
        const orderItems = (await dbQuery(query2, orders.map((order) => order.id))).rows as DBOrderItem[];

        return orders.map((order) => {
            return {
                id: order.id,
                user_id: order.user_id,
                amount: order.amount,
                invoice: order.invoice,
                status: order.status,
                items: orderItems?.filter((item) => item.order_id === order.id).map((item) => {
                    return { item_id: item.item_id, quantity: item.quantity }
                })
            }
        })
    } catch (err) {
        log.error('fetchOrder() query failed:', err);
        throw err;
    }
}

