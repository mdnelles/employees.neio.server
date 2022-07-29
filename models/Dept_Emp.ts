import SequelizeDT from "Sequelize";
const dbDT = require("../database/db.ts");

module.exports = dbDT.SequelizeDT.define(
   "dept_emp",
   {
      emp_no: {
         type: SequelizeDT.INTEGER,
         primaryKey: true,
         allowNull: false,
      },
      dept_no: {
         type: SequelizeDT.STRING,
         primaryKey: true,
         allowNull: false,
      },
      from_date: {
         type: SequelizeDT.DATE,
         defaultValue: SequelizeDT.NOW,
         allowNull: false,
      },
      to_date: {
         type: SequelizeDT.DATE,
         defaultValue: SequelizeDT.NOW,
         allowNull: false,
      },
   },
   {
      timestamps: false,
   }
);
