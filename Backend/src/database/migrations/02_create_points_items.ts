import Knex from 'knex'; // Type Knex from typescript

export async function up(knex: Knex) {

    return knex.schema.createTable('point_items',table => {

        table.increments('id').primary(); // PK
        table.integer('point_id').notNullable().references('id').inTable('points'); // FK table points - field id
        table.integer('item_id').notNullable().references('id').inTable('items'); // FK

    });


}
export async function down(knex: Knex) {

    return knex.schema.dropTable('point_items');

}