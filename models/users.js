const { Sequelize, DataTypes } = require('sequelize');
let db = require('../connection');

const User = db.define('User', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING
  }
}, {
    freezeTableName: true
});

module.exports = User;