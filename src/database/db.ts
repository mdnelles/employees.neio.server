//require("dotenv").config({ path: __dirname + "/.env" });
import { Sequelize } from "sequelize";
const env = require("dotenv").config().parsed;
//const config = require(path.join(__dirname))
console.log("------__dirname-----");
console.log(__dirname);

export const db: any = {};
const sequelize = new Sequelize(
   env.NODE_DB_NAME,
   env.NODE_DB_USER,
   env.NODE_DB_PASS,
   {
      port: env.NODE_DB_PORT,
      host: env.NODE_DB_HOST,
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