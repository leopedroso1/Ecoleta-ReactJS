import Knex from 'knex'; // Type Knex from typescript


export async function up(knex: Knex) { // This parameter is our bound with knex
    // Create all tables

    return knex.schema.createTable('points', table => {

        table.increments('id').primary //incremental value, PK
        table.string('image').notNullable();
		table.string('name').notNullable();
		table.string('email').notNullable();
		table.string('whatsapp').notNullable();
		table.decimal('lat').notNullable();
		table.decimal('lon').notNullable();
		table.string('city').notNullable();
        table.string('uf', 2).notNullable();

    });
} 



export async function down(knex: Knex) {
    // Rollback if necessary

   return knex.schema.dropTable('point');

} 