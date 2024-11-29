/** import packages [start] */
import { NextFunction, Request, Response, Router } from 'express';
/** import packages [end] */

/** import prerequisites [start] */
import { handleSuccessResponse } from '../../../../modules/server';
import authMiddleware from '../../../middlewares/auth';
import validate from '../../../middlewares/validate';
import { listCategorySchema } from '../../../validations/category';
import Logger from "../../../../utils/logger";
import { ListCategoryDetails } from './types';
import { fetchCategory } from '../../../../databaseQuery/category';
/** import prerequisites [end] */

/** Logger initialization [start] */
const log = Logger('externalServer/apis/v1/category/list.ts');
/** Logger initialization [end] */

const listCategory = (route: Router) => {
    return route.get('/list', [
        validate(listCategorySchema, 'query'),
        authMiddleware,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const queryPayload = req.query as ListCategoryDetails;
                const categroies = await fetchCategory({ in_store: queryPayload.inStore });

                handleSuccessResponse(res, {
                    data: {
                        categroies,
                    }
                });
            } catch (err) {
                log.error('listCategory() api failed:', err);
                next(err);
            }
        }])
}

export default listCategory;