/** import prerequisites [start] */
import { INVENTORY_LEVEL, OptionalFields, RequiredFields } from "../../../../databaseQuery/types";
/** import prerequisites [end] */

export type Item = {
    itemId: string;
    name: string;
    description: string;
    categoryId: string;
    inventoryLevel: INVENTORY_LEVEL;
    unit: 'kg' | 'g' | 'l' | 'ml';
    price: string;
    startPrice: string;
    stock: string;
    inStock: string;
    inStore: string;
    isExpired: string;
    expiredAt: number;
}


export type AddItemDetails = RequiredFields<Item, 'name' | 'description' | 'categoryId' | 'inventoryLevel' | 'unit' | 'price' | 'stock'>
    & OptionalFields<Item, 'expiredAt'>

export type ListItemDetails = OptionalFields<Item, 'itemId' | 'inStock' | 'categoryId' | 'inventoryLevel' | 'unit' | 'isExpired' | 'inStore' | 'startPrice'>

export type UpdateItemDetails = OptionalFields<Item, 'name' | 'description' | 'categoryId' | 'inventoryLevel' | 'price' | 'stock' | 'expiredAt' | 'inStore'>