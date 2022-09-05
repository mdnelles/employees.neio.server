import Sequelize from "sequelize";
import { db } from "../database/db";

export const Logs = db.sequelize.define(
   "log",
   {
      id: {
         type: Sequelize.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      filename: {
         type: Sequelize.STRING,
      },
      code: {
         type: Sequelize.STRING,
      },
      fnction: {
         type: Sequelize.STRING,
      },
      msg_programmer: {
         type: Sequelize.STRING,
      },
      msg_app: {
         type: Sequelize.STRING,
      },
      ip: {
         type: Sequelize.STRING,
      },
      refer: {
         type: Sequelize.STRING,
      },
      tdate: {
         type: Sequelize.STRING,
      },
   },
   {
      timestamps: false,
   }
);
