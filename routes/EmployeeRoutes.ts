import express, { Request, Response } from "express";
const employee = express.Router();
const Sequelize = require("sequelize");
import cors from "cors";
import bcrypt from "bcrypt";
import { db } from "../database/db";
import { verifyToken } from "../components/RoutFuctions";
import { Employees } from "../models/Employees";
import { Salarie } from "../models/Salaries";
import log2db from "../components/Logger";
import { ip, getDate } from "../components/Global";

employee.use(cors());

employee.post("/add", verifyToken, async (req: Request, res: Response) => {
   try {
      const { uuid, first_name, last_name, email, password } = req.body;
      var today = new Date();
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
         error,
         ip,
         req.headers.referer,
         getDate()
      );
      res.json({ status: 200, err: true, msg: "", error });
      console.log(error);
   }
});

employee.post("/edit", verifyToken, async (req: Request, res: Response) => {
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
         error,
         ip,
         req.headers.referer,
         getDate()
      );
      res.json({ status: 200, err: true, msg: "catch", error });
      console.log(error);
   }
});

employee.post(
   "/remove_employee",
   verifyToken,
   async (req: Request, res: Response) => {
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
            error,
            ip,
            req.headers.referer,
            getDate()
         );
         res.json({ status: 200, err: true, msg: "user exists", error });
      }
   }
);

employee.post(
   "/get_employees",
   verifyToken,
   async (req: Request, res: Response) => {
      try {
         const data = await Employees.findAll({ limit: 10000 });
         res.json({ status: 200, err: false, msg: "ok", data });
      } catch (error) {
         log2db(
            500,
            __filename.split(/[\\/]/).pop(),
            "getemployees",
            "catch",
            error,
            ip,
            req.headers.referer,
            getDate()
         );
         res.json({ status: 201, err: true, msg: "user exists", error });
      }
   }
);

employee.post(
   "/get_details",
   verifyToken,
   async (req: Request, res: Response) => {
      try {
         const data1 = await Salarie.findAll({
            where: { emp_no: req.body.id },
         });

         let data2 = db.sequelize.query(
            `SELECT * FROM dept_emps  LEFT JOIN departments ON  dept_emps.dept_no=departments.dept_no WHERE dept_emps.emp_no= :emp_no`,
            {
               replacements: {
                  emp_no: req.body.id,
               },
               type: Sequelize.QueryTypes.SELECT,
            }
         );

         let obj = {
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
            error,
            ip,
            req.headers.referer,
            getDate()
         );
         res.json({ status: 200, err: true, msg: "", error });
         console.log(error);
      }
   }
);

module.exports = employee;
