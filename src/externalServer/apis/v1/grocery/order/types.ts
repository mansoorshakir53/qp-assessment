/** import prerequisites [start] */
import { OptionalFields, RequiredFields, ORDER_STATUS } from "../../../../../databaseQuery/types";
/** import prerequisites [end] */

export type Order = {
    orderId: string;
    amount: string;
    itemId: string;
    quantity: number;
    price: number;
    stock?: number;
    status: ORDER_STATUS;
}


export type AddOrderDetails = {
    orders: RequiredFields<Order, 'itemId' | 'quantity' | 'stock'>[]
}

export type ListOrderDetails = OptionalFields<Order, 'orderId' | 'amount' | 'status'>
