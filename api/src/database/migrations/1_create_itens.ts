import Knex from "knex";

export function up(knex: Knex) {
    return knex.schema.createTable('itens',table=>{
        table.increments('id').primary();
        table.string('image').notNullable();
        table.string('title').notNullable();
    });

}

export function down(knex: Knex) {
    return  knex.schema.dropTable('itens');
}