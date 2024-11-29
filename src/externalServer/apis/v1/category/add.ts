/** import packages [start] */
import { NextFunction, Request, Response, Router } from 'express';
/** import packages [end] */

/** import prerequisites [start] */
import { handleSuccessResponse } from '../../../../modules/server';
import authMiddleware from '../../../middlewares/auth';
import bindRole from '../../../middlewares/role';
import { StatusCode, UserRole } from '../../../../types';
import validate from '../../../middlewares/validate';
import { addCategorySchema } from '../../../validations/category';
import Logger from "../../../../utils/logger";
import { AddCategoryDetails } from './types';
import { insertCategory } from '../../../../databaseQuery/category';
/** import prerequisites [end] */

/** Logger initialization [start] */
const log = Logger('externalServer/apis/v1/category/add.ts');
/** Logger initialization [end] */

const addCategory = (route: Router) => {
    return route.post('/add', [
        validate(addCategorySchema, 'body'),
        bindRole(UserRole.ADMIN),
        authMiddleware,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const bodyPayload = req.body as AddCategoryDetails;

                const newCategory = await insertCategory({
                    name: bodyPayload.name,
                })

                handleSuccessResponse(res, {
                    message: `Category ${bodyPayload.name} Added!`,
                    data: {
                        category: newCategory,
                    },
                    status: StatusCode.CREATED,
                });

            } catch (err) {
                log.error('addCategory() api failed:', err);
                next(err);
            }
        }])
}

export default addCategory;