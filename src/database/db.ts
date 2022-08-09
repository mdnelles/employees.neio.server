import { Sequelize } from "sequelize";
const env = require("dotenv").config().parsed;
const host = env.NODE_DB_HOST;

export const db: any = {};
const sequelize = new Sequelize(
   env.NODE_DB_NAME,
   env.NODE_DB_USER,
   env.NODE_DB_PASS,
   {
      port: env.NODE_DB_PORT,
      host,
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
