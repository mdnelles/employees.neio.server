//import Sequelize from "sequelize";
import { db } from "../database/db";

export const api = async (req: any, res: any): Promise<any> => {
   res.json({ status: 201, err: false, msg: "basic api" });
   console.log(" >>>> basic");
};

export const schemas = async (req: any, res: any): Promise<any> => {
   try {
      const schemas = await db.sequelize.query("SHOW SCHEMAS");

      res.json({ status: 201, err: false, msg: "ok", schemas });
   } catch (error) {
      console.log(error);
      res.json({ status: 201, err: true, msg: "", error });
   }
};

export const tables = async (req: any, res: any): Promise<any> => {
   try {
      const tables = await db.sequelize.query("SHOW TABLES");

      res.json({ status: 201, err: false, msg: "ok", tables });
   } catch (error) {
      console.log(error);
      res.json({ status: 201, err: true, msg: "", error });
   }
};
