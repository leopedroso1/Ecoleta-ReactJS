import Knex from 'knex'; // Type Knex from typescript

export async function up(knex: Knex) {

    return knex.schema.createTable('items', table => {

        table.increments('id').primary //incremental value, PK
        table.string('image').notNullable();
		table.string('title').notNullable();
		
    });
}
export async function down(knex: Knex) {

    return knex.schema.dropTable('items');

}