/** import packages [start] */
import { NextFunction, Request, Response, Router } from 'express';
/** import packages [end] */

/** import prerequisites [start] */
import { handleSuccessResponse } from '../../../../modules/server';
import authMiddleware from '../../../middlewares/auth';
import bindRole from '../../../middlewares/role';
import { UserRole } from '../../../../types';
import Logger from "../../../../utils/logger";
import validate from '../../../middlewares/validate';
import { removeGrocerySchema } from '../../../validations/grocery';
import { deleteGrocery } from '../../../../databaseQuery/grocery';
import { deleteFile } from '../../../../utils/helper';
/** import prerequisites [end] */

/** Logger initialization [start] */
const log = Logger('externalServer/apis/v1/grocery/remove.ts');
/** Logger initialization [end] */

const removeGrocery = (route: Router) => {
    return route.delete('/remove/:itemId', [
        validate(removeGrocerySchema, 'params'),
        bindRole(UserRole.ADMIN),
        authMiddleware,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const itemId = req.params.itemId;

                const deletedItem = await deleteGrocery(itemId);
                if (deletedItem?.image_path)
                    deleteFile(deletedItem.image_path);
                handleSuccessResponse(res, {
                    message: 'Item Deleted!'
                });
            } catch (err) {
                log.error('removeGrocery() api failed:', err);
                next(err);
            }
        }])
}

export default removeGrocery;