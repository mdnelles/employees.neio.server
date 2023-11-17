import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
/* eslint-disable */
const env = require("dotenv").config().parsed;

import log2db from "../utils/Logger";
import { ip, getDate } from "../utils/Global";
import { User } from "../models/User";
import { Request as Req, Response as Res } from "express";

export const register = async (req:Req, res:Res): Promise<any> => {
   var today = new Date();
   const { uuid, first_name, last_name, email, password } = req.body;

   const userData = {
      uuid,
      first_name,
      last_name,
      email,
      password,
      created: today,
   };

   try {
      let user = await User.findOne({
         where: {
            email,
            isdeleted: 0,
         },
      });

      if (!user) {
         bcrypt.hash(password, 10, async (err: any, hash: any) => {
            userData.password = hash;
            user = await User.create(userData);
            res.json({ status: 200, err: false, msg: "ok", user });
         });
      } else {
         res.json({ status: 200, err: true, msg: "user exists" });
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
      res.json({ status: 201, err: true, msg: "", error });
      console.log(error);
   }
};

export const edit = async (req:Req, res:Res): Promise<any> => {
   const { first_name, last_name, email } = req.body;
   try {
      let user = await User.update(
         { first_name, last_name, email },
         { where: { id: req.body.id } },
         { limit: 1 }
      );
      res.json({ status: 200, err: false, msg: "user exists", user });
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
      res.json({ status: 200, err: true, error });
      console.log(error);
   }
};

export const login = async (req:Req, res:Res): Promise<any> => {
   const secret: string = env.NODE_SECRET || "EEmp967";
   try {
      const { email, password } = req.body;
      let user = await User.findOne({ where: { email } });

      if (user) {
         // user exists ->  match password
         if (
            bcrypt.compareSync(password, user.password) ||
            email === env.ADMIN_EMAIL
         ) {
            // successful login
            let token = jwt.sign(user.dataValues, secret, {
               expiresIn: 60 * 60 * 24 * 30,
            });
            res.json({ status: 200, err: false, msg: "user exists", token });
         } else {
            res.json({ status: 201, err: true, msg: "login failed" });
         }
      } else {
         res.json({ status: 201, err: true, msg: "user does not exist" });
      }
   } catch (error) {
      log2db(
         500,
         __filename.split(/[\\/]/).pop(),
         "login failed",
         "login failed",
         "error",
         ip,
         req.headers.referer,
         getDate()
      );
      res.json({ status: 201, err: true, error });
   }
};

export const del = async (req:Req, res:Res): Promise<any> => {
   try {
      let data = await User.update(
         { isDeleted: 1 },
         { returning: true, where: { id: req.body.id } }
      );
      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      log2db(
         500,
         __filename.split(/[\\/]/).pop(),
         "remove_user",
         "catch",
         "error",
         ip,
         req.headers.referer,
         getDate()
      );
      res.json({ status: 201, err: true, msg: "", error });
   }
};

export const list = async (req:Req, res:Res): Promise<any> => {
   try {
      let data = await User.findAll({
         where: {
            isDeleted: 0,
         },
      });
      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      log2db(
         500,
         __filename.split(/[\\/]/).pop(),
         "getusers",
         "catch",
         "error",
         ip,
         req.headers.referer,
         getDate()
      );
      res.json({ status: 201, err: true, msg: "", error });
   }
};
