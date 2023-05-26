module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: 'kandula.db.elephantsql.com',
      port: '5432',
      user: 'vkzsbicr',
      password: 'gaQfUop0YHHJbv6_FmRK_0mDjqWrzNgU',
      database: 'vkzsbicr'
    },


    migrations: {
      directory: './migrations'
    },
    useNullAsDefault: true
  }


  
};
