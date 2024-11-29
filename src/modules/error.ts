/** import prerequisites [start] */
import { StatusCode } from '../types';
/** import prerequisites [end] */

class CustomError extends Error {
    status: StatusCode;
    message: string;
    constructor(message: string, status: StatusCode) {
        super(message);
        this.status = status;
        this.message = message;
    }
}

export default CustomError;