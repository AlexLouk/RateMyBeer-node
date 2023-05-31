const knex = require('knex')({
    client: 'pg',
    connection: {
      host: 'kandula.db.elephantsql.com',
      port: '5432',
      user: 'vkzsbicr',
      password: 'gaQfUop0YHHJbv6_FmRK_0mDjqWrzNgU',
      database: 'vkzsbicr'
    },
    useNullAsDefault: true
  });
  
  knex.select().from('rmb.about')
    .then(rows => {
      console.log(rows); 
    })
    .catch(error => {
      console.error(error);
    })
    .finally(() => {
      knex.destroy();
    });
  