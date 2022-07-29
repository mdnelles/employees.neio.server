const SequelizeDE = require("sequelize");
const dbDE = require("../database/db.ts");

module.exports = dbDE.sequelize.define(
   "dept_manager",
   {
      emp_no: {
         type: SequelizeDE.INTEGER,
         primaryKey: true,
         allowNull: false,
      },
      dept_no: {
         type: SequelizeDE.STRING,
         primaryKey: true,
         allowNull: false,
      },
      from_date: {
         type: SequelizeDE.STRING,
         allowNull: false,
      },
      to_date: {
         type: SequelizeDE.DATE,
         defaultValue: SequelizeDE.NOW,
         allowNull: false,
      },
   },
   {
      timestamps: false,
   }
);
