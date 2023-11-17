import Sequelize from "sequelize";
import { db } from "../database/db";
import log2db from "../utils/Logger";
import { ip, getDate } from "../utils/Global";
import { Request as Req, Response as Res } from "express";

export const list = async (req:Req, res:Res): Promise<any> => {
   try {
      const low = req.body.salaryRange || 50000;
      const high = low + 2499;
      const data = await db.sequelize.query(
         ` SELECT s.emp_no, 
                    ANY_VALUE(salary) as any_salary,
                    ANY_VALUE(from_date) as any_start,
                    ANY_VALUE(to_date) as any_finish,
                    e.first_name,
                    e.last_name
               FROM salaries as s
               JOIN employees AS e ON
                    s.emp_no=e.emp_no
                    WHERE s.salary > :low 
                    AND s.salary < :high
                    GROUP BY s.emp_no
               LIMIT 50000`,
         {
            replacements: {
               low,
               high,
            },
            type: Sequelize.QueryTypes.SELECT,
         }
      );

      res.json({ status: 201, err: false, msg: "ok", data });
   } catch (error) {
      log2db(
         500,
         __filename.split(/[\\/]/).pop(),
         "getsalarys",
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
