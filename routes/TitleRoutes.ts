import express, { Request, Response } from "express";
const title = express.Router();
const Sequelize = require("sequelize");
import { db } from "../database/db";
import { verifyToken } from "./RoutFuctions";
import { Title } from "../models/Titles";
import { Salarie } from "../models/Salaries";
import log2db from "../components/Logger";
import { ip, getDate } from "../components/Global";

title.post(
   "/remove_title",
   verifyToken,
   async (req: Request, res: Response) => {
      try {
         let data = await Title.update(
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
            error,
            ip,
            req.headers.referer,
            getDate()
         );
         console.log(error);
         res.json({ status: 201, err: true, msg: "", error });
      }
   }
);

title.post("/get_titles", verifyToken, async (req: Request, res: Response) => {
   try {
      let data = await db.sequelize.query(
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
         error,
         ip,
         req.headers.referer,
         getDate()
      );
      console.log(error);
      res.json({ status: 201, err: true, msg: "", error });
   }
});

title.post("/get_details", verifyToken, async (req: Request, res: Response) => {
   const { id } = req.body;
   try {
      let data1 = Salarie.findAll({
         where: { emp_no: id },
      });
      let data2 = await db.sequelize.query(
         `SELECT * FROM dept_emps  LEFT JOIN titles ON  dept_emps.dept_no=titles.dept_no WHERE dept_emps.emp_no= :emp_no`,
         {
            replacements: {
               emp_no: id,
            },
            type: Sequelize.QueryTypes.SELECT,
         }
      );

      let obj = {
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
         error,
         ip,
         req.headers.referer,
         getDate()
      );
      console.log(error);
      res.json({ status: 201, err: true, msg: "", error });
   }
});

module.exports = { title };
