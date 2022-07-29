import express, { Request, Response } from "express";
const salary = express.Router();
import { db } from "../database/db";
const Sequelize = require("sequelize");
import { verifyToken } from "./RoutFuctions";
import { log2db } from "../components/Logger";
import { ip, get_date } from "../components/Global";

salary.post(
   "/get_salaries",
   verifyToken,
   async (req: Request, res: Response) => {
      try {
         let low = req.body.salaryRange;
         let high = low + 2499;
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
               LIMIT 2000`,
            {
               replacements: {
                  low: low,
                  high: high,
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
            error,
            ip,
            req.headers.referer,
            get_date()
         );
         console.log(error);
         res.json({ status: 201, err: true, msg: "", error });
      }
   }
);

module.exports = { salary };
