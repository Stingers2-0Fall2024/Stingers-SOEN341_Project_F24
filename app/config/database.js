// Sequelize is called to interact with databases
const {Sequelize}=require('sequelize');

//Then initializes the instance so that SQLlite is used as the engine
const sequelize=new Sequelize({
  dialect:'sqlite',
  storage:'./database.sqlite' 
});
module.exports = sequelize;
