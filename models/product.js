// var db = require("../db");
const DataTypes = require('sequelize');
const sequelize = require('../db_sequelize');

const Category = require('./category')

const Product = sequelize.define('product', {
    name_product: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull:false
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false
    },
    genre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    paranoid: true,
    deletedAt: 'deletedAt'
})

Product.belongsTo(Category);
Category.hasMany(Product);

module.exports = { Product }