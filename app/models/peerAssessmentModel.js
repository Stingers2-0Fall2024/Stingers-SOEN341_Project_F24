// peerAssessmentModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PeerAssessment=sequelize.define('PeerAssessment', {
    studentId:{
        type: DataTypes.STRING(8),
        allowNull: false,
    },
    teammateId: {
        type: DataTypes.STRING(8),
        allowNull: false,
    },
    collaboration: {
        type: DataTypes.INTEGER,
        allowNull:false,
    },
    communication: {
        type: DataTypes.INTEGER,
        allowNull:false,
    },
    contribution: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    conceptualContribution: { //Added as required on "4. Dimension-Based Assessment"
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    practicalContribution: { //Added as required on "4. Dimension-Based Assessment"
        type: DataTypes.INTEGER,
        allowNull:false,
    },
    workEthic: {// Added as required on "4. Dimension-Based Assessment"
        type: DataTypes.INTEGER,
        allowNull:false,
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    timestamps: true,
});
module.exports=PeerAssessment;
