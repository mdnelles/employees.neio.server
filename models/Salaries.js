const Sequelize = require('sequelize');
const db = require('../database/db.js');

module.exports = db.sequelize.define(
   'salarie',
   {
      emp_no: {
         type: Sequelize.INTEGER,
         primaryKey: true,
         allowNull: false
      },
      salary: {
         type: Sequelize.INTERGER,
         allowNull: false
      },
      from_date: {
         type: Sequelize.DATE,
         defaultValue: Sequelize.NOW,
         primaryKey: true,
         allowNull: false
      },
      to_date: {
         type: Sequelize.DATE,
         defaultValue: Sequelize.NOW,
         allowNull: false
      }
   },
   {
      timestamps: false
   }
);
