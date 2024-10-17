// commentModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Defining to store teacher's comments
const Comment= sequelize.define('Comment', {
    studentId: {  // For the student's ID 
        type: DataTypes.STRING,
        allowNull:false,
    },
    groupId: {  // For Group comments 
        type: DataTypes.INTEGER,
        allowNull:true,
    },
    comment: { //For storing the teacher's comment
        type: DataTypes.TEXT,
        allowNull:false,
    },
}, {
    timestamps:false,  //No timestamps for now
});

module.exports=Comment;
