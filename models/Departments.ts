const SequelizeDP: any = require("Sequelize");
const dbDP: any = require("../database/db.ts");

module.exports = dbDP.SequelizeDP.define(
   "department",
   {
      dept_no: {
         type: SequelizeDP.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      dept_name: {
         type: SequelizeDP.STRING,
      },
   },
   {
      timestamps: false,
   }
);
