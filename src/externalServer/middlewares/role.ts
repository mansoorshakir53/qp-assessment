/** import packages [start] */
import { NextFunction, Request, Response } from 'express';
/** import packages [end] */

/** import prerequisites [start] */
import { UserRole } from '../../types';
/** import prerequisites [end] */


const bindRole = (role: UserRole) => {
    return (req: Request, _: Response, next: NextFunction) => {
        req.user = { role, email: '', id: '' };
        next();
    }
}

export default bindRole;