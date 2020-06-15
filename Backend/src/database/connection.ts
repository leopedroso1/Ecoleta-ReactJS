import knex from 'knex';
import path from 'path'; // This library acts like a path binder. In other words if you create a file "index.js" it will return the full path independently of your OS. 

const connection = knex({
    client: 'sqlite',
    connection: {
        filename: path.resolve(__dirname, 'database.sqlite'),
    }
});

export default connection;

// Migrations >> Database history. It is like the "github" from DB. You can use JS to create your tables as well
// NOTICE: THE ORDER OF THE FILES IS THE ORDER TO BE EXECUTED