import Sequelize from "sequelize";
import { db } from "../database/db";

module.exports = db.Sequelize.define(
   "dept_emp",
   {
      emp_no: {
         type: Sequelize.INTEGER,
         primaryKey: true,
         allowNull: false,
      },
      dept_no: {
         type: Sequelize.STRING,
         primaryKey: true,
         allowNull: false,
      },
      from_date: {
         type: Sequelize.DATE,
         defaultValue: Sequelize.NOW,
         allowNull: false,
      },
      to_date: {
         type: Sequelize.DATE,
         defaultValue: Sequelize.NOW,
         allowNull: false,
      },
   },
   {
      timestamps: false,
   }
);
