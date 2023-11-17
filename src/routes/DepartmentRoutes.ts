import Sequelize from "sequelize";
import bcrypt from "bcrypt";
import { db } from "../database/db";
import { Departments } from "../models/Departments";
import { Salarie } from "../models/Salaries";
import log2db from "../utils/Logger";
import { ip, getDate } from "../utils/Global";

import { Request as Req, Response as Res } from "express";

export const search = async (req:Req, res:Res): Promise<any> => {
   try {
      const { first_name, last_name, email, password } = req.body;
      const today = new Date();
      const departmentData = {
         first_name,
         last_name,
         email,
         password,
         created: today,
      };

      let department = await Departments.findOne({
         where: {
            email,
            isdeleted: 0,
         },
      });

      if (!department) {
         department = await bcrypt.hash(
            password,
            10,
            (error: any, hash: any) => {
               departmentData.password = hash;
               const data = Departments.create(departmentData);
               res.json({ status: 201, err: false, msg: "ok", data });
            }
         );
      } else {
         res.json({ status: 201, err: true, msg: "dept already exists" });
      }
   } catch (error) {
      log2db(
         500,
         __filename.split(/[\\/]/).pop(),
         "register.2",
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

export const edit = async (req:Req, res:Res): Promise<any> => {
   try {
      const { id, first_name, last_name, email } = req.body;
      const data = await Departments.update(
         {
            first_name,
            last_name,
            email,
         },
         { where: { id } },
         { limit: 1 }
      );
      res.json({ status: 201, err: false, msg: "ok", data });
   } catch (error) {
      log2db(
         500,
         __filename.split(/[\\/]/).pop(),
         "register.2",
         "catch",
         "error",
         ip,
         req.headers.referer,
         getDate()
      );
      res.json({ status: 201, err: true, msg: "", error });
      console.log(error);
   }
};

export const remove_department = async (req:Req, res:Res): Promise<any> => {
   try {
      const data = await Departments.update(
         { isDeleted: 1 },
         { returning: true, where: { id: req.body.id } }
      );
      res.json({ status: 201, err: false, msg: "ok", data });
   } catch (error) {
      log2db(
         500,
         __filename.split(/[\\/]/).pop(),
         "remove_department",
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

export const get_departments = async (req:Req, res:Res): Promise<any> => {
   try {
      const data = await Departments.findAll({ limit: 1000 });
      res.json({ status: 201, err: false, msg: "ok", data });
   } catch (error) {
      log2db(
         500,
         __filename.split(/[\\/]/).pop(),
         "getdepartments",
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

export const get_emp_by_depo = async (req:Req, res:Res): Promise<any> => {
   try {
      const data = await db.sequelize.query(
         `SELECT * FROM dept_emps  LEFT JOIN employees ON  dept_emps.emp_no=employees.emp_no WHERE dept_emps.dept_no= :dept_no LIMIT 250`,
         {
            replacements: {
               dept_no: req.body.dept_no,
            },
            type: Sequelize.QueryTypes.SELECT,
         }
      );
      res.json({ status: 201, err: false, msg: "", data });
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
      console.log(error);
      res.json({ status: 201, err: true, msg: "", error });
   }
};

export const get_details = async (req:Req, res:Res): Promise<any> => {
   try {
      const { id } = req.body;
      const data1 = await Salarie.findAll({
         where: { emp_no: id },
      });

      const data2 = await db.sequelize.query(
         `SELECT * FROM dept_emps  LEFT JOIN departments ON  dept_emps.dept_no=departments.dept_no WHERE dept_emps.emp_no= :emp_no`,
         {
            replacements: {
               emp_no: id,
            },
            type: Sequelize.QueryTypes.SELECT,
         }
      );

      const data = {
         departments: data2,
         salaries: data1,
      };
      res.json({ status: 201, err: false, msg: "", data });
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
      console.log(error);
      res.json({ status: 201, err: true, msg: "", error });
   }
};
