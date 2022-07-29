const SequelizeER1 = require("Sequelize");
let DB = require("../database/db.ts");

DB.SequelizeER1.define(
   "employee",
   {
      emp_no: {
         type: SequelizeER1.INTEGER,
         primaryKey: true,
         allowNull: false,
      },
      birth_date: {
         type: SequelizeER1.DATE,
         allowNull: false,
      },
      first_name: {
         type: SequelizeER1.STRING,
         defaultValue: "fn",
         allowNull: false,
      },
      last_name: {
         type: SequelizeER1.STRING,
         defaultValue: "ln",
         allowNull: false,
      },
      gender: {
         type: SequelizeER1.STRING,
         values: ["M", "F", "X"],
         allowNull: false,
      },
      hire_date: {
         type: SequelizeER1.DATE,
         defaultValue: SequelizeER1.NOW,
         allowNull: false,
      },
   },
   {
      timestamps: false,
   }
);
module.exports = { employee };
