/** import packages [start] */
import { NextFunction, Request, Response, Router } from 'express';
/** import packages [end] */

/** import prerequisites [start] */
import { handleSuccessResponse } from '../../../../modules/server';
import authMiddleware from '../../../middlewares/auth';
import Logger from "../../../../utils/logger";
import { deleteCategory } from '../../../../databaseQuery/category';
import validate from '../../../middlewares/validate';
import bindRole from '../../../middlewares/role';
import { UserRole } from '../../../../types';
import { removeCategorySchema } from '../../../validations/category';
/** import prerequisites [end] */

/** Logger initialization [start] */
const log = Logger('externalServer/apis/v1/category/remove.ts');
/** Logger initialization [end] */

const removeCategory = (route: Router) => {
    return route.delete('/remove/:categoryId', [
        validate(removeCategorySchema, 'params'),
        bindRole(UserRole.ADMIN),
        authMiddleware,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const categoryId = req.params.categoryId as string;

                await deleteCategory(categoryId);

                handleSuccessResponse(res, {
                    message: 'Category Deleted',
                })
            } catch (err) {
                log.error('removeCategory() api failed:', err);
                next(err);
            }
        }])
}

export default removeCategory;