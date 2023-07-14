const { Sequelize, DataTypes } = require('sequelize');
let db = require('../connection');

const Order = db.define('class_order', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  order_date: {
    type: DataTypes.STRING,
    allowNull: false
  },
  meeting_date: {
    type: DataTypes.STRING,
    allowNull: false
  },
  complaint: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  class_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  response_midtrans: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
    timestamps: true,
    freezeTableName: true
});

module.exports = Order;