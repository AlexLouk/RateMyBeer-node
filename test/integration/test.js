const { sequelize } = require('./dbconection'); // Importiere dein sequelize-Objekt
const { User } = require('./dbconection'); // Importiere dein User-Modell

// Teste die Verbindung zur Datenbank und gib alle vorhandenen Benutzer aus
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');

    User.findAll()
      .then(users => {
        console.log(users);
      })
      .catch(err => {
        console.error('Error fetching users:', err);
      });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
