const SequelizeLOG = require("sequelize");
const dbLOG = require("../database/db.ts");

module.exports = dbLOG.sequelize.define(
   "log",
   {
      id: {
         type: SequelizeLOG.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      filename: {
         type: SequelizeLOG.STRING,
      },
      code: {
         type: SequelizeLOG.STRING,
      },
      fnction: {
         type: SequelizeLOG.STRING,
      },
      msg_programmer: {
         type: SequelizeLOG.STRING,
      },
      msg_app: {
         type: SequelizeLOG.STRING,
      },
      ip: {
         type: SequelizeLOG.STRING,
      },
      refer: {
         type: SequelizeLOG.STRING,
      },
      tdate: {
         type: SequelizeLOG.STRING,
      },
   },
   {
      timestamps: false,
   }
);
