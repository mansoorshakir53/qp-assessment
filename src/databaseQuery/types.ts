export type RequiredFields<T, TRequired extends keyof T = keyof T> = Required<Pick<T, TRequired>>;
export type OptionalFields<T, TOptional extends keyof T = keyof T> = Partial<Pick<T, TOptional>>;

export enum USER_ROLE {
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    CUSTOMER = 'customer'
}

export enum INVENTORY_LEVEL {
    RAW = 'raw',
    COMPONENT = 'component',
    FINISHED = 'finished'
}

export enum ORDER_STATUS {
    PLACED = 'placed',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered'
}


export type DBUser = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: USER_ROLE;
    salt: string;
    hash: string;
    is_block: boolean;
    created_at: Date;
    updated_at: Date;
}

export type DBCategory = {
    id: string;
    name: string;
    in_store: boolean;
}

export type DBItem = {
    id: string;
    name: string;
    description: string;
    image_url?: string;
    image_path?: string;
    inventory_level: INVENTORY_LEVEL;
    category_id: string;
    price: number;
    stock: number;
    unit: 'kg' | 'g' | 'l' | 'ml';
    in_store: boolean;
    expired_at?: Date | number;
    created_at: Date;
    updated_at: Date;
}

export type DBUserOrder = {
    id: string;
    invoice?: string;
    amount: number;
    status: ORDER_STATUS;
    user_id: string;
    created_at: Date;
    updated_at: Date;
}

export type DBOrderItem = {
    id: string;
    order_id: string;
    item_id: string;
    quantity: number;
    stock: number;
    created_at: Date;
    updated_at: Date;
}

export type DBOrder = Pick<DBUserOrder, 'id' | 'user_id' | 'amount' | 'invoice' | 'status'> &
{
    items: Pick<DBOrderItem, 'item_id' | 'quantity'>[]
}

export type DBInsertUser = RequiredFields<DBUser, 'first_name' | 'last_name' | 'email' | 'hash' | 'salt'>
    & OptionalFields<DBUser, 'role'>

export type FetchUserFilter = OptionalFields<DBUser, 'id' | 'email' | 'role' | 'is_block'>

export type DbInsertCategory = RequiredFields<DBCategory, 'name'>

export type FetchCategroyFilter = OptionalFields<DBCategory, 'id' | 'name' | 'in_store'>

export type DbUpdateCategory = OptionalFields<DBCategory, 'name' | 'in_store'>

export type DBInsertItem = RequiredFields<DBItem, 'name' | 'description' | 'category_id' | 'inventory_level' | 'unit' | 'price' | 'stock'>
    & OptionalFields<DBItem, | 'expired_at' | 'image_url' | 'image_path'>

export type FetchItemFilter = OptionalFields<DBItem, 'id' | 'in_store' | 'category_id' | 'inventory_level' | 'unit' | 'price'>
    & { is_expired?: boolean, in_stock?: boolean }

export type DbUpdateItem = OptionalFields<DBItem, 'name' | 'description' | 'category_id' | 'inventory_level' | 'price' | 'stock' | 'expired_at' | 'in_store' | 'image_url' | 'image_path'>

export type DbInsertUserOrder = RequiredFields<DBUserOrder, 'user_id' | 'amount'>
    & OptionalFields<DBUserOrder, 'invoice'>

export type DbInsertOderItem = RequiredFields<DBOrderItem, 'order_id'>
    & { items: RequiredFields<DBOrderItem, 'item_id' | 'quantity' | 'stock'>[] }

export type DbInsertOrder = DbInsertUserOrder & Pick<DbInsertOderItem, 'items'>

export type FetchOrderFilter = OptionalFields<DBUserOrder, 'id' | 'user_id' | 'status' | 'amount'>

