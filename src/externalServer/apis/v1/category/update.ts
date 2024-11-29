/** import packages [start] */
import { NextFunction, Request, Response, Router } from 'express';
/** import packages [end] */

/** import prerequisites [start] */
import { handleSuccessResponse } from '../../../../modules/server';
import authMiddleware from '../../../middlewares/auth';
import bindRole from '../../../middlewares/role';
import { StatusCode, UserRole } from '../../../../types';
import validate from '../../../middlewares/validate';
import { updateCategoryBodySchema, updateCategoryQuerySchema } from '../../../validations/category';
import { UpdateCategoryDetails } from './types';
import Logger from "../../../../utils/logger";
import { updateCategoryData } from '../../../../databaseQuery/category';
/** import prerequisites [end] */

/** Logger initialization [start] */
const log = Logger('externalServer/apis/v1/category/update.ts');
/** Logger initialization [end] */

const updateCategory = (route: Router) => {
    return route.patch('/update/:categoryId', [
        validate(updateCategoryQuerySchema, 'params'),
        validate(updateCategoryBodySchema, 'body'),
        bindRole(UserRole.ADMIN),
        authMiddleware,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const categoryId = req.params.categoryId as string;
                const bodyPayload = req.body as UpdateCategoryDetails;

                const updatedCategory = await updateCategoryData(categoryId, {
                    name: bodyPayload.name,
                    in_store: bodyPayload.inStore,
                });

                handleSuccessResponse(res, {
                    message: 'Category Updated!',
                    data: {
                        category: updatedCategory,
                    }
                });
            } catch (err) {
                log.error('addCategory() api failed:', err);
                next(err);
            }
        }])
}

export default updateCategory;