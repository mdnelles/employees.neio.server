import Sequelize from "sequelize";
import { db } from "../database/db";

export const Departments = db.sequelize.define(
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
