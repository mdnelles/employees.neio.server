import Sequelize from "sequelize";
import bcrypt from "bcrypt";
import { db } from "../database/db";
import { Employees } from "../models/Employees";
import { Salarie } from "../models/Salaries";
import log2db from "../components/Logger";
import { ip, getDate } from "../components/Global";

export const add = async (req: any, res: any): Promise<any> => {
   try {
      const { uuid, first_name, last_name, email, password } = req.body;
      const today = new Date();
      const employeeData = {
         uuid,
         first_name,
         last_name,
         email,
         password,
         created: today,
      };

      let employee = await Employees.findOne({
         where: {
            email,
            isdeleted: 0,
         },
      });

      if (!employee) {
         bcrypt.hash(password, 10, async (err: any, hash: any) => {
            employeeData.password = hash;
            employee = await Employees.create(employeeData);
            res.json({ status: 200, err: false, msg: "user exists", employee });
         });
      } else {
         res.json({ status: 200, err: true, msg: "user exists" });
      }
   } catch (error) {
      log2db(
         500,
         __filename.split(/[\\/]/).pop(),
         "",
         "catch",
         "error",
         ip,
         req.headers.referer,
         getDate()
      );
      res.json({ status: 200, err: true, msg: "", error });
      console.log(error);
   }
};

export const edit = async (req: any, res: any): Promise<any> => {
   try {
      const { id, first_name, last_name, email } = req.body;
      await Employees.update(
         {
            first_name,
            last_name,
            email,
         },
         { where: { id } },
         { limit: 1 }
      );
      res.json({ status: 200, err: false, msg: "user edited" });
   } catch (error) {
      log2db(
         500,
         __filename.split(/[\\/]/).pop(),
         "",
         "catch",
         "error",
         ip,
         req.headers.referer,
         getDate()
      );
      res.json({ status: 200, err: true, msg: "catch", error });
      console.log(error);
   }
};

export const remove = async (req: any, res: any): Promise<any> => {
   try {
      const { id } = req.body;
      await Employees.update(
         { isDeleted: 1 },
         { returning: true, where: { id } }
      );
      res.json({ status: 200, err: false, msg: "employee removed" });
   } catch (error) {
      log2db(
         500,
         __filename.split(/[\\/]/).pop(),
         "remove_employee",
         "catch",
         "error",
         ip,
         req.headers.referer,
         getDate()
      );
      res.json({ status: 200, err: true, msg: "user exists", error });
   }
};

export const list = async (req: any, res: any): Promise<any> => {
   try {
      const sql = `SELECT 
         employees.emp_no,
         employees.birth_date,
         employees.first_name,
         employees.last_name,
         employees.gender,
         employees.hire_date,
         dept_emps.dept_no,
         titles.title
         FROM employees 
            LEFT JOIN dept_emps ON employees.emp_no = dept_emps.emp_no 
            RIGHT JOIN titles ON employees.emp_no = titles.emp_no 
             ORDER BY dept_emps.to_date DESC  LIMIT 3222`;
      const data = await db.sequelize.query(sql);

      res.json({ status: 200, err: false, msg: "ok", data: data[0] });
   } catch (error) {
      log2db(
         500,
         __filename.split(/[\\/]/).pop(),
         "getemployees",
         "catch",
         "error",
         ip,
         req.headers.referer,
         getDate()
      );
      res.json({ status: 201, err: true, msg: "user exists", error });
   }
};

export const details = async (req: any, res: any): Promise<any> => {
   try {
      const data1 = await Salarie.findAll({
         where: { emp_no: req.body.emp_no },
      });

      const data2 = await db.sequelize.query(
         `SELECT * FROM dept_emps  LEFT JOIN departments ON  dept_emps.dept_no=departments.dept_no WHERE dept_emps.emp_no= :emp_no`,
         {
            replacements: {
               emp_no: req.body.emp_no,
            },
            type: Sequelize.QueryTypes.SELECT,
         }
      );

      const obj = {
         departments: data2,
         salaries: data1,
      };

      res.json({ status: 200, err: false, msg: "ok", data: obj });
   } catch (error) {
      log2db(
         500,
         __filename.split(/[\\/]/).pop(),
         "get_details",
         "catch",
         "error",
         ip,
         req.headers.referer,
         getDate()
      );
      res.json({ status: 200, err: true, msg: "", error });
      console.log(error);
   }
};
