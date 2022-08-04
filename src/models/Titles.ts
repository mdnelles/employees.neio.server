import Sequelize from "sequelize";
import { db } from "../database/db";

export const Title = db.sequelize.define(
   "Title",
   {
      emp_no: {
         type: Sequelize.INTEGER,
         primaryKey: true,
         allowNull: false,
      },
      title: {
         type: Sequelize.STRING,
         primaryKey: true,
         allowNull: false,
      },
      from_date: {
         type: Sequelize.STRING,
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
