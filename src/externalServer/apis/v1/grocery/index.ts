/** import packages [start] */
import { Router } from 'express';
/** import packages [end] */

/** import prerequisites [start] */
import addGrocery from './add';
import listGrocery from './list';
import removeGrocery from './remove';
import updateGrocery from './update';
import orderRouter from './order';
/** import prerequisites [end] */

const groceryRouter = Router();

groceryRouter.use('/grocery', [
    addGrocery(groceryRouter),
    listGrocery(groceryRouter),
    removeGrocery(groceryRouter),
    updateGrocery(groceryRouter),
    orderRouter,
]);


export default groceryRouter;


