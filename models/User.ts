import Sequelize from "sequelize";
import { db } from "../database/db";

export const User = db.sequelize.define(
   "user",
   {
      id: {
         type: Sequelize.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      email: {
         type: Sequelize.STRING,
      },
      password: {
         type: Sequelize.STRING,
      },
      first_name: {
         type: Sequelize.STRING,
      },
      last_name: {
         type: Sequelize.STRING,
      },
      admin: {
         type: Sequelize.INTEGER,
      },
      last_login: {
         type: Sequelize.DATE,
         defaultValue: Sequelize.NOW,
      },
      isDeleted: {
         type: Sequelize.INTEGER,
         defaultValue: 0,
      },
      uuid: {
         type: Sequelize.STRING,
      },
   },
   {
      timestamps: false,
   }
);
