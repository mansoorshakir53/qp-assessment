exports.up = async (knex) => {
    await knex.raw(`
        CREATE TABLE category (
            id UUID DEFAULT uuid_generate_v4(),
            name VARCHAR(50) NOT NULL,
            in_store BOOLEAN DEFAULT true,
            PRIMARY KEY(id)
        );
    `);
};

exports.down = async (knex) => {
    await knex.raw(`
       DROP TABLE category;
    `);
};
