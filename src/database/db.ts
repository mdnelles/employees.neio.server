import { Sequelize } from "sequelize";
const env = require("dotenv").config().parsed;

export const db: any = {};
const sequelize = new Sequelize(
   env.NODE_DB_NAME,
   env.NODE_DB_USER,
   env.NODE_DB_PASS,
   {
      //port: env.NODE_DB_PORT,
      //host: env.NODE_DB_HOST,
      port: 3307,
      host: "127.0.0.1",
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
