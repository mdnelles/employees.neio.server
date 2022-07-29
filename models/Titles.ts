const SequelizeTI = require("sequelize");
const dbTI = require("../database/db.ts");

module.exports = dbTI.sequelize.define(
   "title",
   {
      emp_no: {
         type: SequelizeTI.INTEGER,
         primaryKey: true,
         allowNull: false,
      },
      title: {
         type: SequelizeTI.STRING,
         primaryKey: true,
         allowNull: false,
      },
      from_date: {
         type: SequelizeTI.STRING,
         primaryKey: true,
         allowNull: false,
      },
      to_date: {
         type: SequelizeTI.DATE,
         defaultValue: SequelizeTI.NOW,
         allowNull: false,
      },
   },
   {
      timestamps: false,
   }
);
