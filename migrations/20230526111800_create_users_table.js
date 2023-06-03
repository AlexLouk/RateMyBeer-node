const { table } = require("console");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('rmb.user', (table) => {
    table.string('user_email');
    table.string('user_password');
    table.boolean('user_is_admin');
    table.string('user_name');
    table.increments('user_id');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('rmb.users');
};
