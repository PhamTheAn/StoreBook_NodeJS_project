const DataTypes = require('sequelize');
const sequelize = require('../db_sequelize');

const Category = sequelize.define('category', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},{
    paranoid: true,
    deletedAt: 'deletedAt'
})

module.exports = Category;