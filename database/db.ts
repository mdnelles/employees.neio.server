import { Sequelize } from "sequelize";
export const db: any = {};
const sequelize = new Sequelize(
   process.env.NODE_DB_NAME,
   process.env.NODE_DB_USER,
   process.env.NODE_DB_PASS,
   {
      host: process.env.NODE_DB_HOST,
      dialect: "mysql",
      logging: console.log,
      freezeTableName: true,

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
