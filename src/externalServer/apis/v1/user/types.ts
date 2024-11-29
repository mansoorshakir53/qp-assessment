/** import prerequisites [start] */
import { OptionalFields, RequiredFields, USER_ROLE } from "../../../../databaseQuery/types";
/** import prerequisites [end] */

export type User = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: USER_ROLE;
    isBlock: boolean;
}


export type RegisterUserDetails = RequiredFields<User, 'firstName' | 'lastName' | 'email' | 'password'>
    & OptionalFields<User, 'role'>

export type LoginUserDetails = RequiredFields<User, 'email' | 'password'>