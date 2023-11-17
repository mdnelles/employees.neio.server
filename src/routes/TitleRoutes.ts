import Sequelize from "sequelize";
import { db } from "../database/db";
import { Title } from "../models/Titles";
import { Salarie } from "../models/Salaries";
import log2db from "../utils/Logger";
import { ip, getDate } from "../utils/Global";
import { Request as Req, Response as Res } from "express";

export const remove = async (req:Req, res:Res): Promise<any> => {
   try {
      const data = await Title.update(
         { isDeleted: 1 },
         { returning: true, where: { id: req.body.id } }
      );
      res.json({ status: 201, err: false, msg: "ok", data });
   } catch (error) {
      log2db(
         500,
         __filename.split(/[\\/]/).pop(),
         "remove_title",
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

export const list = async (req:Req, res:Res): Promise<any> => {
   try {
      const data = await db.sequelize.query(
         `select titles.title from employees.titles group by titles.title`,
         {
            type: Sequelize.QueryTypes.SELECT,
         }
      );
      res.json({ status: 201, err: false, msg: "ok", data });
   } catch (error) {
      log2db(
         500,
         __filename.split(/[\\/]/).pop(),
         "gettitles",
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

export const details = async (req:Req, res:Res): Promise<any> => {
   const { id } = req.body;
   try {
      const data1 = Salarie.findAll({
         where: { emp_no: id },
      });
      const data2 = await db.sequelize.query(
         `SELECT * FROM dept_emps  LEFT JOIN titles ON  dept_emps.dept_no=titles.dept_no WHERE dept_emps.emp_no= :emp_no`,
         {
            replacements: {
               emp_no: id,
            },
            type: Sequelize.QueryTypes.SELECT,
         }
      );

      const obj = {
         titles: data2,
         salaries: data1,
      };

      res.json({ status: 201, err: false, msg: "ok", data: obj });
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
