declare namespace Express {
    export interface Request {
        user: {
            id: string,
            email: string,
            role?: 'super_admin' | 'admin' | 'customer',
        };
    }
    export interface Response {
        user: any;
    }
}