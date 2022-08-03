//const express = require("express");

const jwt = require("jsonwebtoken");
const env = require("dotenv").config().parsed;
import { Request, Response, NextFunction } from "express";

const tokenTest = (token: string, res: Response, next: any) => {
   jwt.verify(token, env.NODE_SECRET, (error: any) => {
      if (error) {
         console.log("bad token: " + token);
         res.json({ status: 201, err: true, msg: "bad token", error });
      } else {
         next(); // Next middleware
      }
   });
};

const tokenTestAdmin = async (token: string, res: Response, next: any) => {
   jwt.verify(token, env.NODE_SECRET, (error: any, decoded: any) => {
      if (error || decoded.email !== env.NODE_ADMIN_EMAIL) {
         res.json({ status: 201, err: true, msg: "bad admin token" });
      } else {
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
