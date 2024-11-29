/** import packages [start] */
import { NextFunction, Request, Response, Router } from 'express';
import config from 'config';
/** import packages [end] */

/** import prerequisites [start] */
import { handleSuccessResponse } from '../../../../modules/server';
import bindRole from '../../../middlewares/role';
import authMiddleware from '../../../middlewares/auth';
import { StatusCode, UserRole } from '../../../../types';
import validate from '../../../middlewares/validate';
import { updateGroceryBodySchema, updateGroceryQuerySchema } from '../../../validations/grocery';
import upload from '../../../../modules/multer';
import Logger from "../../../../utils/logger";
import { UpdateItemDetails } from './types';
import { deleteFile } from '../../../../utils/helper';
import CustomError from '../../../../modules/error';
import { fetchGrocery, updateGroceryData } from '../../../../databaseQuery/grocery';
/** import prerequisites [end] */

/** Logger initialization [start] */
const log = Logger('externalServer/apis/v1/grocery/update.ts');
/** Logger initialization [end] */

const updateGrocery = (route: Router) => {
    return route.patch('/update/:itemId', [
        upload,
        validate(updateGroceryBodySchema, 'body'),
        validate(updateGroceryQuerySchema, 'query'),
        bindRole(UserRole.ADMIN),
        authMiddleware,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const bodyPayload = req.body as UpdateItemDetails;
                const itemId = req.params.itemId;
                let price: number = 0, stock: number = 0;

                if (bodyPayload.price) {
                    price = parseInt(bodyPayload.price as string, 0);
                    if (price <= 0) throw new CustomError('Price should be grater then 0', StatusCode.BAD_REQUEST);
                }

                if (bodyPayload.stock) {
                    stock = parseInt(bodyPayload.stock as string, 0);
                    if (stock <= 0) throw new CustomError('Stock should be grater then 0', StatusCode.BAD_REQUEST);
                }

                const item = (await fetchGrocery({ id: itemId }))[0];

                if (!item)
                    throw new CustomError('Item not found!', StatusCode.NOT_FOUND);

                const updatedItem = await updateGroceryData(itemId, {
                    name: bodyPayload.name,
                    price,
                    stock,
                    description: bodyPayload.description,
                    category_id: bodyPayload.categoryId,
                    inventory_level: bodyPayload.inventoryLevel,
                    ...bodyPayload.inStore && { in_store: bodyPayload.inStore === 'true' },
                    ...bodyPayload.expiredAt && { expired_at: bodyPayload.expiredAt / 1000.0 },
                    ...req.file && { image_url: `${config.get<string>('ExternalServer.baseUrl')}/images/${req.file.filename}`, image_path: req.file.path },
                });

                if (req.file && item.image_path)
                    deleteFile(item.image_path);
                handleSuccessResponse(res, {
                    message: 'Item updated!',
                    data: {
                        item: updatedItem,
                    }
                })
            } catch (err) {
                log.error('updateGrocery() api failed:', err);
                next(err);
            }
        }])
}

export default updateGrocery;