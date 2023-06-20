require('dotenv').config({path:'../.env'});

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

    pool: { min: 0, max: 1 },
    migrations: {
      directory: './migrations'
    },
    useNullAsDefault: true
  }
};
