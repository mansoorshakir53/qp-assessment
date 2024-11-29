/** import packages [start] */
import joi from 'joi';
/** import packages [end] */

export const addCategorySchema = joi.object({
    name: joi.string().trim().max(50).required(),
});

export const listCategorySchema = joi.object({
    inStore: joi.string().trim().optional(),
});

export const removeCategorySchema = joi.object({
    categoryId: joi.string().trim().uuid({ version: 'uuidv4' }).required(),
});

export const updateCategoryBodySchema = joi.object({
    name: joi.string().trim().optional(),
    inStore: joi.bool().optional(),
});

export const updateCategoryQuerySchema = joi.object({
    categoryId: joi.string().trim().uuid({ version: 'uuidv4' }).required(),
});