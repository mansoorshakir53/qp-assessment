/** import packages [start] */
import joi from 'joi';
/** import packages [end] */

export const registerUserSchema = joi.object({
    firstName: joi.string().trim().max(50).required(),
    lastName: joi.string().trim().max(50).required(),
    email: joi.string().trim().email().required(),
    password: joi.string().trim().min(8).required(),
    role: joi.string().trim().valid('super_admin', 'admin', 'customer').optional(),
});

export const loginUserSchema = joi.object({
    email: joi.string().trim().email().required(),
    password: joi.string().trim().min(8).required(),
});