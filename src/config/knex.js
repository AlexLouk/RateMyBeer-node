require("dotenv").config();

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PW,
      database: process.env.DB
    },


    migrations: {
      directory: './migrations'
    },
    useNullAsDefault: true
  }
};
