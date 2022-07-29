import jwt from "jsonwebtoken";
import { log2db } from "../components/Logger";
import { Request, Response, NextFunction } from "express";
import { ip, get_date } from "../components/Global";

const tokenTest = (
   token: string,
   res: Response,
   jwt: any,
   caller: any,
   next: NextFunction
) => {
   jwt.verify(token, process.env.SECRET_KEY, (error: any) => {
      if (error) {
         log2db(
            500,
            __filename.split(/[\\/]/).pop(),
            "Token Test",
            "bad token",
            error,
            ip,
            caller,
            get_date()
         );
         console.log("bad token: " + token);
         res.json({ status: 201, err: true, msg: "bad token", error });
      } else {
         log2db(
            200,
            __filename.split(/[\\/]/).pop(),
            "Token Test",
            "Token accepted",
            "",
            ip,
            caller,
            get_date()
         );
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
      const caller = req.body.caller || req.headers.referer || null;

      tokenTest(token, res, jwt, caller, next);
   } catch (error) {
      console.log(error);
      res.json({ status: 201, err: true, msg: "bad token", error });
   }
};
