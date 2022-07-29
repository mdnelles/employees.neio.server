const SequelizeSES = require("sequelize");
const dbSES = require("../database/db.ts");

module.exports = dbSES.sequelize.define(
   "departments",
   {
      dept_no: {
         type: SequelizeSES.STRING,
         primaryKey: true,
      },
      dept_name: {
         type: SequelizeSES.STRING,
      },
   },
   {
      timestamps: false,
   }
);
