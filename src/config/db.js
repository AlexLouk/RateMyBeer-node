const knex = require("knex");
const knexfile = require('./knexFile.js');

const db = knex(knexfile.development);

module.exports = db;