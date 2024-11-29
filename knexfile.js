// Update with your config settings.
const dotenv = require('dotenv');

dotenv.config();

const config = require('config');

module.exports = {
  configuration: {
    client: 'pg',
    connection: {
      host: config.get('Database.host'),
      port: config.get('Database.port'),
      user: config.get('Database.username'),
      password: config.get('Database.password'),
      database: config.get('Database.name'),
    },
    pool: {
      min: config.get('Database.minConnections'),
      max: config.get('Database.maxConnections'),
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
};
