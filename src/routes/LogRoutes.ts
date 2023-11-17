import Sequelize from "sequelize";
import { db } from "../database/db";
import log2db from "../utils/Logger";
import { ip, getDate } from "../utils/Global";

import { Request as Req, Response as Res } from "express";

export const list = async (req:Req, res:Res): Promise<any> => {
   try {
      const { page, code = "500", perPage = 20 } = req.body;

      const offset =
         page !== undefined && !isNaN(page) ? page * perPage - perPage : 10;

      const data = await db.sequelize.query(
         "SELECT * FROM logs WHERE code LIKE :code ORDER BY id DESC LIMIT 9500",
         {
            replacements: {
               code: `%${code}%`,
               perPage: perPage,
               offset: offset,
            },
            type: Sequelize.QueryTypes.SELECT,
         }
      );

      res.json({ status: 200, err: false, msg: "", data });
   } catch (error) {
      log2db(
         500,
         __filename.split(/[\\/]/).pop(),
         "get_logs",
         "catch",
         "error",
         ip,
         req.headers.referer,
         getDate()
      );
      console.log(error);
      res.json({ status: 201, err: true, msg: "", error });
   }
};

export const get_count = async (req:Req, res:Res): Promise<any> => {
   try {
      const { code = 500 } = req.body;

      let data = await db.sequelize.query(
         "SELECT count(*) FROM logs WHERE code = :code ",
         {
            replacements: {
               code: code,
            },
            type: Sequelize.QueryTypes.SELECT,
         }
      );

      data = JSON.stringify(data);
      const temp1 = data.split(":");
      const temp2 = temp1[1].split("}");
      const num = temp2[0];
      res.json({ status: 200, err: false, msg: "log count", data: num });
   } catch (error) {
      log2db(
         500,
         __filename.split(/[\\/]/).pop(),
         "get_count (logs)",
         "catch",
         "error",
         ip,
         req.headers.referer,
         getDate()
      );
      console.log(error);
      res.json({ status: 201, err: true, msg: "", error });
   }
};
