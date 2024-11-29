/** import packages [start] */
import { Router } from 'express';
/** import packages [end] */

/** import prerequisites [start] */
import addCategory from './add';
import listCategory from './list';
import removeCategory from './remove';
import updateCategory from './update';
/** import prerequisites [end] */

const categoryRouter = Router();

categoryRouter.use('/category', [
    addCategory(categoryRouter),
    listCategory(categoryRouter),
    removeCategory(categoryRouter),
    updateCategory(categoryRouter)
]);


export default categoryRouter;


