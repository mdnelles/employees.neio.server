const SequelizeSAL = require("sequelize");
const dbSAL = require("../database/db.ts");

module.exports = dbSAL.sequelize.define(
   "salarie",
   {
      emp_no: {
         type: SequelizeSAL.INTEGER,
         primaryKey: true,
         allowNull: false,
      },
      salary: {
         type: SequelizeSAL.INTEGER,
         allowNull: false,
      },
      from_date: {
         type: SequelizeSAL.DATE,
         defaultValue: SequelizeSAL.NOW,
         primaryKey: true,
         allowNull: false,
      },
      to_date: {
         type: SequelizeSAL.DATE,
         defaultValue: SequelizeSAL.NOW,
         allowNull: false,
      },
   },
   {
      timestamps: false,
   }
);
