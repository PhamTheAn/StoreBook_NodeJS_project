// var db = require("../db");
const DataTypes = require('sequelize');
const sequelize = require('../db_sequelize');

// const { Comment } = require('./comment')


const User = sequelize.define('User', {
  username: {
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
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  }
},
{
  paranoid: true,
  deletedAt: 'deletedAt'
});


module.exports = { User }