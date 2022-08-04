import Sequelize from "sequelize";
import { db } from "../database/db";

module.exports = db.sequelize.define(
   "departments",
   {
      dept_no: {
         type: Sequelize.STRING,
         primaryKey: true,
      },
      dept_name: {
         type: Sequelize.STRING,
      },
   },
   {
      timestamps: false,
   }
);
