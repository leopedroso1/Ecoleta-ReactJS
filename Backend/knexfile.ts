// Runtime Knex file. We need to use the same configuration in the "connection.ts" + "migrations clause"

import path from 'path';

module.exports = { //for Knex files, we need to use module.exports

    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'src', 'database', 'database.sqlite') 
    },
    migrations: {
        directory: path.resolve(__dirname, 'src', 'database', 'migrations') 
    },
    seeds: {
        directory: path.resolve(__dirname, 'src', 'database', 'seeds') 
    },
    useNullAsDefault: true,
};