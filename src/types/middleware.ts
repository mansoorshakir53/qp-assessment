export type TokenPayload = {
    id: string;
    email: string;
    role: UserRole;
};

export enum UserRole {
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    CUATOMER = 'customer',
};