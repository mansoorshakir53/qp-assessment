/** import packages [start] */
import { NextFunction, Request, Response, Router } from 'express';
import config from 'config';
/** import packages [end] */

/** import prerequisites [start] */
import { handleSuccessResponse } from '../../../../modules/server';
import authMiddleware from '../../../middlewares/auth';
import bindRole from '../../../middlewares/role';
import { StatusCode, UserRole } from '../../../../types';
import validate from '../../../middlewares/validate';
import { addGrocerySchema } from '../../../validations/grocery';
import upload from '../../../../modules/multer';
import Logger from "../../../../utils/logger";
import { AddItemDetails } from './types';
import { fetchCategory } from '../../../../databaseQuery/category';
import CustomError from '../../../../modules/error';
import { insertGrocery } from '../../../../databaseQuery/grocery';
/** import prerequisites [end] */

/** Logger initialization [start] */
const log = Logger('externalServer/apis/v1/grocery/add.ts');
/** Logger initialization [end] */

const addGrocery = (route: Router) => {
    return route.post('/add', [
        upload,
        validate(addGrocerySchema, 'body'),
        bindRole(UserRole.ADMIN),
        authMiddleware,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const bodyPayload = req.body as AddItemDetails;
                const price = parseInt(bodyPayload.price as string, 0);
                const stock = parseInt(bodyPayload.stock as string, 0);

                if (price <= 0) throw new CustomError('Price should be grater then 0', StatusCode.BAD_REQUEST);

                if (stock <= 0) throw new CustomError('Stock should be grater then 0', StatusCode.BAD_REQUEST);

                const category = (await fetchCategory({
                    id: bodyPayload.categoryId,
                }))[0];

                if (!category)
                    throw new CustomError('Category not found!', StatusCode.NOT_FOUND);

                const newItem = await insertGrocery({
                    name: bodyPayload.name,
                    price,
                    unit: bodyPayload.unit,
                    stock,
                    description: bodyPayload.description,
                    category_id: bodyPayload.categoryId,
                    inventory_level: bodyPayload.inventoryLevel,
                    ...bodyPayload.expiredAt && { expired_at: bodyPayload.expiredAt / 1000.0 },
                    ...req.file && { image_url: `${config.get<string>('ExternalServer.baseUrl')}/images/${req.file.filename}`, image_path: req.file.path }
                });

                handleSuccessResponse(res, {
                    message: 'Item Added!',
                    data: {
                        item: newItem
                    },
                    status: StatusCode.CREATED,
                })
            } catch (err) {
                log.error('addGrocery() api failed:', err);
                next(err);
            }
        }])
}

export default addGrocery;