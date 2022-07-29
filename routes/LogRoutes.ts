const expressLG = require("express");
const Logs = expressLG.Router();
const corsLOG = require("cors");
const dbLG = require("../database/db");
const SequelizeLG = require("sequelize");
const Log = require("../models/Logs");
const LogfnLG = require("../components/Logger");
const rfLG = require("./RoutFuctions");

let ipLG = "0.0.0.0";
let tdateLG = LogfnLG.get_date();
let fileNameLG = __filename.split(/[\\/]/).pop();

Logs.post("/get_logs", rfLG.verifyToken, async (req: any, res: any) => {
   try {
      const { page, code = "500", perPage = 20 } = req.body;

      let offset =
         page !== undefined && !isNaN(page) ? page * perPage - perPage : 10;

      let data = await dbLG.sequelize.query(
         "SELECT * FROM logs WHERE code LIKE :code ORDER BY id DESC LIMIT 9500",
         {
            replacements: {
               code: `%${code}%`,
               perPage: perPage,
               offset: offset,
            },
            type: SequelizeLG.QueryTypes.SELECT,
         }
      );

      res.json({ status: 200, err: false, msg: "", data });
   } catch (error) {
      LogfnLG.log2db(
         500,
         fileNameLG,
         "get_Logs",
         "catch",
         error,
         ipLG,
         req.headers.referer,
         tdateLG
      );
      console.log(error);
      res.json({ status: 201, err: true, msg: "", error });
   }
});

Logs.post("/get_logcount", rfLG.verifyToken, async (req: any, res: any) => {
   try {
      const { code = 500 } = req.body;

      let data = await dbLG.sequelize.query(
         "SELECT count(*) FROM logs WHERE code = :code ",
         {
            replacements: {
               code: code,
            },
            type: SequelizeLG.QueryTypes.SELECT,
         }
      );

      data = JSON.stringify(data);
      let temp1 = data.split(":");
      let temp2 = temp1[1].split("}");
      let num = temp2[0];
      res.json({ status: 200, err: false, msg: "log count", data: num });
   } catch (error) {
      LogfnLG.log2db(
         500,
         fileNameLG,
         "get_count (logs)",
         "catch",
         error,
         ipLG,
         req.headers.referer,
         tdateLG
      );
      console.log(error);
      res.json({ status: 201, err: true, msg: "", error });
   }
});

module.exports = { Logs };
