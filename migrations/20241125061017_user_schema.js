exports.up = async (knex) => {
    await knex.raw(`
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        CREATE TYPE user_role AS ENUM('super_admin','admin','customer');

        CREATE TABLE users (
            id UUID DEFAULT uuid_generate_v4(),
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            email VARCHAR(255) NOT NULL,
            role user_role DEFAULT 'customer',
            salt VARCHAR(128) NOT NULL,
            hash VARCHAR(192) NOT NULL,
            is_block BOOLEAN DEFAULT false,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY(id)
        );
    `);
};

exports.down = async (knex) => {
    await knex.raw(`
       DROP TABLE users;
       DROP TYPE user_role;
       DROP EXTENSION "uuid-ossp";
    `);
};
