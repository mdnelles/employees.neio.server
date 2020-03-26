const Sequelize = require('sequelize');
const db = require('../database/db.js');

module.exports = db.sequelize.define(
   'dept_emp',
   {
      emp_no: {
         type: Sequelize.INTEGER,
         primaryKey: true,
         allowNull: false
      },
      dept_no: {
         type: Sequelize.STRING,
         primaryKey: true,
         allowNull: false
      },
      from_date: {
         type: Sequelize.DATE,
         defaultValue: Sequelize.NOW,
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
