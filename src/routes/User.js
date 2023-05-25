const { DataTypes } = require('sequelize');
const sequelize = new Sequelize(databaseUrl);

const User = sequelize.define('users', {
  user_email: {
    type: DataTypes.char,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;
