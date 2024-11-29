exports.up = async (knex) => {
    await knex.raw(`
        CREATE TYPE invetory_level_type AS ENUM('raw', 'component', 'finished');

        CREATE TYPE unit_type AS ENUM('kg', 'g', 'l', 'ml');


        CREATE TABLE items (
            id UUID DEFAULT uuid_generate_v4(),
            name VARCHAR(50) NOT NULL,
            description VARCHAR(100) NOT NULL,
            image_url VARCHAR(100),
            image_path VARCHAR(100),
            inventory_level invetory_level_type NOT NULL,
            category_id UUID NOT NULL,
            price INTEGER NOT NULL,
            stock INTEGER NOT NULL,
            unit unit_type NOT NULL,
            in_store BOOLEAN DEFAULT true,
            expired_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY(id),
            CONSTRAINT category_id_fk FOREIGN KEY(category_id) REFERENCES category(id) ON DELETE CASCADE
        );
    `);
};

exports.down = async (knex) => {
    await knex.raw(`
       DROP TABLE items;
       DROP TYPE unit_type;
       DROP TYPE invetory_level_type;
    `);
};
