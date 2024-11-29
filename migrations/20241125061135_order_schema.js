exports.up = async (knex) => {
    await knex.raw(`
        CREATE TYPE order_status_type AS ENUM('placed', 'shipped', 'delivered');

        CREATE TABLE user_orders (
            id UUID DEFAULT uuid_generate_v4(),
            invoice VARCHAR(100),
            amount INTEGER NOT NULL,
            status order_status_type DEFAULT 'placed',
            user_id UUID NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY(id),
            CONSTRAINT user_id_fk FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        );

         CREATE TABLE order_items (
            id UUID DEFAULT uuid_generate_v4(),
            order_id UUID NOT NULL,
            item_id UUID NOT NULL,
            quantity INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY(id),
            CONSTRAINT order_id_fk FOREIGN KEY(order_id) REFERENCES user_orders(id) ON DELETE CASCADE,
            CONSTRAINT item_id_fk FOREIGN KEY(item_id) REFERENCES items(id)
        );
    `);
};

exports.down = async (knex) => {
    await knex.raw(`
       DROP TABLE order_items;
       DROP TABLE user_orders;
       DROP TYPE order_status_type;
    `);
};
