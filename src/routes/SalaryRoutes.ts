import Sequelize from "sequelize";
import { db } from "../database/db";
import log2db from "../components/Logger";
import { ip, getDate } from "../components/Global";

export const list = async (req: any, res: any): Promise<any> => {
   try {
      let low = req.body.salaryRange || 50000;
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
