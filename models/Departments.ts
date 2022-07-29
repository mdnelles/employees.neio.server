import Sequelize from "sequelize";
import { db } from "../database/db";

module.exports = db.Sequelize.define(
   "department",
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
