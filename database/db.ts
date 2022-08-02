//require("dotenv").config({ path: __dirname + "/.env" });
import dotenv from "dotenv";
import { Sequelize } from "sequelize";
console.log(dotenv);
const env = require("dotenv").config().parsed;
console.log(env);

export const db: any = {};
const sequelize = new Sequelize(
   process.env.NODE_DB_NAME,
   process.env.NODE_DB_USER,
   process.env.NODE_DB_PASS,
   {
      host: process.env.NODE_DB_HOST,
      dialect: "mysql",
      logging: console.log,

      pool: {
         max: 5,
         min: 0,
         acquire: 30000,
         idle: 10000,
      },
   }
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
