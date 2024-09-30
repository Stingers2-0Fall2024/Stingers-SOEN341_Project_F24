const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Defining the User structure with Sequelize 
//This defines the structure in the database with an email, password, role and timestamps
const User=sequelize.define('User',{
  email: {
    type:DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password:{
    type:DataTypes.STRING,
    allowNull:false,
  },
  role: {
    type:DataTypes.ENUM('admin', 'student'),
    defaultValue: 'student',
  }
}, {
  timestamps: true,
});
module.exports = User;
