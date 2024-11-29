/** import packages [start] */
import { NextFunction, Request, Response, Router } from 'express';
/** import packages [end] */

/** import prerequisites [start] */
import { handleSuccessResponse } from '../../../../../modules/server';
import authMiddleware from '../../../../middlewares/auth';
import validate from '../../../../middlewares/validate';
import { listOrderSchema } from '../../../../validations/grocery';
import { ListOrderDetails } from './types';
import Logger from "../../../../../utils/logger";
import { fetchOrder } from '../../../../../databaseQuery/grocery';
/** import prerequisites [end] */

/** Logger initialization [start] */
const log = Logger('externalServer/apis/v1/grocery/order/list.ts');
/** Logger initialization [end] */

const listOrder = (route: Router) => {
    return route.get('/order/list', [
        validate(listOrderSchema, 'query'),
        authMiddleware,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const queryPayload = req.query as ListOrderDetails;

                const orders = await fetchOrder({
                    id: queryPayload.orderId,
                    user_id: req.user.id,
                    status: queryPayload.status,
                    ...queryPayload.amount !== undefined && { amount: parseInt(queryPayload.amount as string, 0) },
                });

                handleSuccessResponse(res, {
                    data: {
                        orders,
                    }
                });
            } catch (err) {
                log.error('listOrder() api failed:', err);
                next(err);
            }

        }])
}

export default listOrder;