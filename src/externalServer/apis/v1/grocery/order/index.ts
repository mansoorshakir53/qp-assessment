/** import packages [start] */
import { Router } from 'express';
/** import packages [end] */

/** import prerequisites [start] */
import orderGrocery from './add';
import listOrder from './list';
/** import prerequisites [end] */

const orderRouter = Router();

orderRouter.use('/grocery', [
    orderGrocery(orderRouter),
    listOrder(orderRouter),
]);


export default orderRouter;


