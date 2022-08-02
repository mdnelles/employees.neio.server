import { Request, Response } from "express";
import Sequelize from "sequelize";
import bcrypt from "bcrypt";
import { db } from "../database/db";
import { verifyToken } from "../components/RoutFuctions";
import { DeptManagers } from "../models/DeptManager";
import { Salarie } from "../models/Salaries";
import log2db from "../components/Logger";
import { ip, getDate } from "../components/Global";

export const add = async (req: Request, res: Response): Promise<any> => {
   try {
      const { uuid, first_name, last_name, email, password } = req.body;
      var today = new Date();
      let dept_managerData = {
         uuid,
         first_name,
         last_name,
         email,
         password,
         created: today,
      };

      let dept_manager = await DeptManagers.findOne({
         where: {
            email: req.body.email,
            isdeleted: 0,
         },
      });

      if (!dept_manager) {
         bcrypt.hash(req.body.password, 10, async (err: any, hash: any) => {
            dept_managerData.password = hash;
            dept_manager = await DeptManagers.create(dept_managerData);
            res.json({
               status: 201,
               err: false,
               msg: "ok",
               data: dept_manager,
            });
         });
      } else {
         res.json({ status: 201, err: true, msg: "manager already exists" });
      }
   } catch (error) {
      log2db(
         500,
         __filename.split(/[\\/]/).pop(),
         "register.1",
         "catch",
         error,
         ip,
         req.headers.referer,
         getDate()
      );
      res.json({ status: 201, err: true, msg: "", error });
      console.log(error);
   }
};

export const edit = async (req: Request, res: Response): Promise<any> => {
   try {
      const { id, first_name, last_name, email } = req.body;
      let data = await DeptManagers.update(
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
         error,
         ip,
         req.headers.referer,
         getDate()
      );
      res.json({ status: 201, err: true, msg: "", error });
      console.log(error);
   }
};

export const rem_manager = async (
   req: Request,
   res: Response
): Promise<any> => {
   try {
      const data = await DeptManagers.update(
         { isDeleted: 1 },
         { returning: true, where: { id: req.body.id } }
      );
      res.json({ status: 201, err: false, msg: "ok", data });
   } catch (error) {
      log2db(
         500,
         __filename.split(/[\\/]/).pop(),
         "remove_dept_manager",
         "catch",
         error,
         ip,
         req.headers.referer,
         getDate()
      );
      console.log(error);
      res.json({ status: 201, err: true, msg: "", error });
   }
};

export const list = async (req: Request, res: Response): Promise<any> => {
   try {
      let data = await db.sequelize.query(
         `SELECT 
         dept_managers.from_date, 
         dept_managers.to_date, 
         departments.dept_name, 
         departments.dept_no, 
         employees.first_name, 
         employees.last_name, 
         employees.emp_no 
       FROM dept_managers 
       JOIN departments on 
         departments.dept_no=dept_managers.dept_no
       LEFT JOIN employees on 
         employees.emp_no=dept_managers.emp_no 
       `,
         {
            type: Sequelize.QueryTypes.SELECT,
         }
      );
      res.json({ status: 201, err: false, msg: "ok", data });
   } catch (error) {
      log2db(
         500,
         __filename.split(/[\\/]/).pop(),
         "getdept_managers",
         "catch",
         error,
         ip,
         req.headers.referer,
         getDate()
      );
      console.log(error);
      res.json({ status: 201, err: true, msg: "", error });
   }
};

export const get_emp_v_depo = async (
   req: Request,
   res: Response
): Promise<any> => {
   try {
      let data = await db.sequelize.query(
         `SELECT 
         dept_managers.from_date, 
         dept_managers.to_date, 
         departments.dept_name, 
         employees.first_name, 
         employees.last_name, 
         employees.emp_no 
       FROM dept_managers 
       JOIN departments on 
         departments.dept_no=dept_managers.dept_no
       LEFT JOIN employees on 
         employees.emp_no=dept_managers.emp_no 
       `,
         {
            replacements: {
               dept_no: req.body.dept_no,
            },
            type: Sequelize.QueryTypes.SELECT,
         }
      );
      res.json({ status: 201, err: false, msg: "ok", data });
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
      console.log(error);
      res.json({ status: 201, err: true, msg: "", error });
   }
};

export const details = async (req: Request, res: Response): Promise<any> => {
   try {
      const { id } = req.body;
      let data1 = await Salarie.findAll({
         where: { emp_no: id },
      });

      let data2 = await db.sequelize.query(
         `SELECT * FROM dept_emps  LEFT JOIN dept_managers ON  dept_emps.dept_no=dept_managers.dept_no WHERE dept_emps.emp_no= :emp_no`,
         {
            replacements: {
               emp_no: id,
            },
            type: Sequelize.QueryTypes.SELECT,
         }
      );

      let obj = {
         dept_managers: data2,
         salaries: data1,
      };

      res.json({ status: 201, err: false, msg: "ok", data: obj });
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
      console.log(error);
      res.json({ status: 201, err: true, msg: "", error });
   }
};
