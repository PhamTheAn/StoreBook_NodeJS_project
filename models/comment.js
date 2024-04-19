const DataTypes = require('sequelize');
const sequelize = require('../db_sequelize');


const { User } = require('./user')
const { Product } = require('./product')


    const Comment = sequelize.define("comment", {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: User,
          key: 'id',
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false
      },
      
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Product,
          key: 'id',
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
      },
    },{
      paranoid: true,
      deletedAt: 'deletedAt'
  });

    Comment.associate = (models) => {
        Comment.belongsTo(models.users, {
            foreignKey: "id",
            as: "commentUser"
        })
    
    }
    // Comment.belongsTo(User, {
    //     foreignKey: "id"
    // });

    Comment.associate = (models) => {
        Comment.belongsTo(models.products, {
            foreignKey: "id",
            as: "product"
        })
    
    }
    // Comment.belongsTo(Product, {
    //     foreignKey: "id"
    // });

    module.exports = { Comment }


