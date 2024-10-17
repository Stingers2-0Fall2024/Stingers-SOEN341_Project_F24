// teamModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Defining teams
const Teams=sequelize.define('Teams', {
    groupNumber: {  //For group number
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    groupName: {  // Group names (they should be provided from frontend )
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {  // For storing student names
        type: DataTypes.TEXT, 
        allowNull: false,
    },
}, {
    timestamps: false,//No need for timestamps at the moment
});
module.exports = Teams;
