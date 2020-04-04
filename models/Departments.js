const Sequelize = require('sequelize');
const db = require('../database/db.js');

module.exports = db.sequelize.define(
   'department',
   {
      dept_no: {
         type: Sequelize.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      dept_name: {
         type: Sequelize.STRING,
      },
   },
   {
      timestamps: false,
   }
);
