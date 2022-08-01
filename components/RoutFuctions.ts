import jwt from "jsonwebtoken";
import log2db from "./Logger";
import { Request, Response, NextFunction } from "express";
import { ip, getDate } from "./Global";
require("dotenv").config({ path: __dirname + "/.env" });

const tokenTest = (token: string, res: Response, next: NextFunction) => {
   jwt.verify(token, process.env.NODE_SECRET, (error: any) => {
      if (error) {
         console.log("bad token: " + token);
         res.json({ status: 201, err: true, msg: "bad token", error });
      } else {
         next(); // Next middleware
      }
   });
};

const tokenTestAdmin = async (
   token: string,
   res: Response,
   next: NextFunction
) => {
   jwt.verify(token, process.env.NODE_SECRET, (error: any, decoded: any) => {
      if (error || decoded.email !== process.env.NODE_ADMIN_EMAIL) {
         console.log("------bad admin token: ");
         res.json({ status: 201, err: true, msg: "bad admin token" });
      } else {
         console.log("----good admin token");
         next(); // Next middleware
      }
   });
};

export const verifyToken = (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   try {
      const token = req.body.token || req.headers.token || null;

      tokenTest(token, res, next);
   } catch (error) {
      console.log(error);
      res.json({ status: 201, err: true, msg: "bad token", error });
   }
};

export const verifyTokenAdmin = (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   try {
      const token: any = req.body.token || req.headers.token || null;

      tokenTestAdmin(token, res, next);
   } catch (error) {
      console.log(error);
      res.json({ status: 201, err: true, msg: "bad token", error });
   }
};
