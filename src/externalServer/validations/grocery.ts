/** import packages [start] */
import joi from 'joi';
/** import packages [end] */

export const addGrocerySchema = joi.object({
    name: joi.string().trim().max(50).required(),
    description: joi.string().trim().min(5).max(100).required(),
    categoryId: joi.string().trim().uuid({ version: 'uuidv4' }).required(),
    inventoryLevel: joi.string().trim().valid('raw', 'component', 'finished').required(),
    unit: joi.string().trim().valid('kg', 'g', 'l', 'ml').required(),
    price: joi.string().required(),
    stock: joi.string().required(),
    expiredAt: joi.string().optional().allow('')
});

export const listGrocerySchema = joi.object({
    itemId: joi.string().trim().uuid({ version: 'uuidv4' }).optional(),
    categoryId: joi.string().trim().uuid({ version: 'uuidv4' }).optional(),
    inStock: joi.string().optional().valid('true', 'false'),
    inventoryLevel: joi.string().trim().valid('raw', 'component', 'finished').optional(),
    unit: joi.string().trim().valid('kg', 'g', 'l', 'ml').optional(),
    startPrice: joi.string().optional(),
    isExpired: joi.string().optional().valid('true', 'false'),
    inStore: joi.string().optional().valid('true', 'false'),
});

export const removeGrocerySchema = joi.object({
    itemId: joi.string().trim().uuid({ version: 'uuidv4' }).required(),
});

export const orderGrocerySchema = joi.object({
    orders: joi.array().items(joi.object({
        itemId: joi.string().trim().uuid({ version: 'uuidv4' }).required(),
        quantity: joi.number().precision(0).required(),
    }))
});

export const listOrderSchema = joi.object({
    orderId: joi.string().trim().uuid({ version: 'uuidv4' }).optional(),
    amount: joi.string().trim().optional(),
    status: joi.string().trim().valid('placed', 'shipped', 'delivered').optional(),
});

export const updateGroceryBodySchema = joi.object({
    name: joi.string().trim().optional(),
    description: joi.string().trim().min(5).max(100).optional(),
    categoryId: joi.string().trim().uuid({ version: 'uuidv4' }).optional(),
    inventoryLevel: joi.string().trim().valid('raw', 'component', 'finished').optional(),
    price: joi.string().optional(),
    stock: joi.string().optional(),
    expiredAt: joi.string().optional().allow(''),
    inStore: joi.string().optional().valid('true', 'false'),
});

export const updateGroceryQuerySchema = joi.object({
    itemId: joi.string().trim().uuid({ version: 'uuidv4' }).optional(),
});