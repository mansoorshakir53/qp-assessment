/** import packages [start] */
import { NextFunction, Request, Response, Router } from 'express';
/** import packages [end] */

/** import prerequisites [start] */
import { handleSuccessResponse } from '../../../../../modules/server';
import authMiddleware from '../../../../middlewares/auth';
import validate from '../../../../middlewares/validate';
import { orderGrocerySchema } from '../../../../validations/grocery';
import { AddOrderDetails } from './types';
import Logger from "../../../../../utils/logger";
import { fetchGrocery, insertOrderTx } from '../../../../../databaseQuery/grocery';
import CustomError from '../../../../../modules/error';
import { StatusCode } from '../../../../../types';
/** import prerequisites [end] */

/** Logger initialization [start] */
const log = Logger('externalServer/apis/v1/grocery/order/add.ts');
/** Logger initialization [end] */

const orderGrocery = (route: Router) => {
    return route.post('/order/add', [
        validate(orderGrocerySchema, 'body'),
        authMiddleware,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const bodyPayload = req.body as AddOrderDetails;
                let totalOrderAmount = 0;
                for (const item of bodyPayload.orders) {
                    const itemDetails = (await fetchGrocery({
                        id: item.itemId,
                    }))[0];

                    if (!item)
                        throw new CustomError('Item not found', StatusCode.NOT_FOUND);
                    if (item.quantity > itemDetails.stock)
                        throw new CustomError(`Item ${item.itemId} order quantity exceed it's stocks`, StatusCode.BAD_REQUEST);

                    totalOrderAmount += (item.quantity * itemDetails.price);
                    item.stock = itemDetails.stock - item.quantity;
                }

                const newOrder = await insertOrderTx({
                    user_id: req.user.id,
                    amount: totalOrderAmount,
                    items: bodyPayload.orders.map((item) => {
                        return {
                            item_id: item.itemId,
                            quantity: item.quantity,
                            stock: item.stock,
                        }
                    }),
                });

                handleSuccessResponse(res, {
                    message: 'Order Placed!',
                    data: {
                        order: newOrder,
                    },
                    status: StatusCode.CREATED,
                })
            } catch (err) {
                log.error('orderGrocery() api failed:', err);
                next(err);
            }

        }])
}

export default orderGrocery;