import Sequelize from "sequelize";
import { db } from "../database/db";

export const Salarie = db.sequelize.define(
   "salarie",
   {
      emp_no: {
         type: Sequelize.INTEGER,
         primaryKey: true,
         allowNull: false,
      },
      salary: {
         type: Sequelize.INTEGER,
         allowNull: false,
      },
      from_date: {
         type: Sequelize.DATE,
         defaultValue: Sequelize.NOW,
         primaryKey: true,
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
