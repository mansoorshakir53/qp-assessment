/** import packages [start] */
import { NextFunction, Request, Response, Router } from 'express';
/** import packages [end] */

/** import prerequisites [start] */
import { handleSuccessResponse } from '../../../../modules/server';
import authMiddleware from '../../../middlewares/auth';
import validate from '../../../middlewares/validate';
import { listGrocerySchema } from '../../../validations/grocery';
import Logger from "../../../../utils/logger";
import { ListItemDetails } from './types';
import { fetchGrocery } from '../../../../databaseQuery/grocery';
/** import prerequisites [end] */

/** Logger initialization [start] */
const log = Logger('externalServer/apis/v1/grocery/list.ts');
/** Logger initialization [end] */

const listGrocery = (route: Router) => {
    return route.get('/list', [
        validate(listGrocerySchema, 'query'),
        authMiddleware,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const queryPayload = req.query as ListItemDetails;

                const items = await fetchGrocery({
                    id: queryPayload.itemId,
                    category_id: queryPayload.categoryId,
                    ...queryPayload.inStock && { in_stock: queryPayload.inStock === 'true' },
                    ...queryPayload.inStore && { in_store: queryPayload.inStore === 'true' },
                    inventory_level: queryPayload.inventoryLevel,
                    ...queryPayload.isExpired && { is_expired: queryPayload.isExpired === 'true' },
                    ...queryPayload.startPrice && { price: parseInt(queryPayload.startPrice as string, 0) },
                    unit: queryPayload.unit,
                });

                handleSuccessResponse(res, {
                    data: {
                        items,
                    }
                });
            } catch (err) {
                log.error('listGrocery() api failed:', err);
                next(err);
            }
        }])
}

export default listGrocery;