const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('bookstore', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
  });

module.exports = sequelize;