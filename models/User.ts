const SequelizeUSER = require("sequelize");
const dbUSER = require("../database/db.ts");

module.exports = dbUSER.sequelize.define(
   "user",
   {
      id: {
         type: SequelizeUSER.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      email: {
         type: SequelizeUSER.STRING,
      },
      password: {
         type: SequelizeUSER.STRING,
      },
      first_name: {
         type: SequelizeUSER.STRING,
      },
      last_name: {
         type: SequelizeUSER.STRING,
      },
      admin: {
         type: SequelizeUSER.INTEGER,
      },
      last_login: {
         type: SequelizeUSER.DATE,
         defaultValue: SequelizeUSER.NOW,
      },
      isDeleted: {
         type: SequelizeUSER.INTEGER,
         defaultValue: 0,
      },
      uuid: {
         type: SequelizeUSER.STRING,
      },
   },
   {
      timestamps: false,
   }
);
