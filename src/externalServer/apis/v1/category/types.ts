/** import prerequisites [start] */
import { OptionalFields, RequiredFields } from "../../../../databaseQuery/types";
/** import prerequisites [end] */

export type Category = {
    name: string;
    inStore: boolean;
}


export type AddCategoryDetails = RequiredFields<Category, 'name'>

export type ListCategoryDetails = OptionalFields<Category, 'inStore'>

export type UpdateCategoryDetails = OptionalFields<Category, 'name' | 'inStore'>