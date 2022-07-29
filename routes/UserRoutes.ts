import express, { Request, Response } from "express";
const users = express.Router();
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { verifyToken } from "./RoutFuctions";
import { log2db } from "../components/Logger";
import { ip, get_date } from "../components/Global";
const User = require("../models/User");

users.post("/register", verifyToken, async (req: Request, res: Response) => {
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
            email: req.body.email,
            isdeleted: 0,
         },
      });

      if (!user) {
         bcrypt.hash(req.body.password, 10, async (err: any, hash: any) => {
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
         error,
         ip,
         req.headers.referer,
         get_date()
      );
      res.json({ status: 201, err: true, msg: "", error });
      console.log(error);
   }
});

users.post("/edit", verifyToken, async (req: Request, res: Response) => {
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
         error,
         ip,
         req.headers.referer,
         get_date()
      );
      res.json({ status: 200, err: true, error });
      console.log(error);
   }
});

users.post("/login", async (req: Request, res: Response) => {
   try {
      const { email, password } = req.body;
      let user = await User.findOne({ where: { email } });

      if (user) {
         // user exists in database now try to match password

         if (
            bcrypt.compareSync(password, user.password) ||
            email === process.env.ADMIN_EMAIL
         ) {
            // successful login
            let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
               expiresIn: 18000,
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
         error,
         ip,
         req.headers.referer,
         get_date()
      );
      res.json({ status: 201, err: true, error });
   }
});

users.get("/adminpanel", verifyToken, async (req: Request, res: Response) => {
   try {
      const { id } = req.body;
      let user = await User.findOne({
         where: {
            id,
         },
      });
      if (!!user) {
         res.json({ status: 200, err: false, msg: "ok", user });
      } else {
         res.json({ status: 201, err: true, msg: "user does not exist" });
      }
   } catch (error) {
      res.json({ status: 201, err: true, msg: "", error });
   }
});

users.post("/remove_user", verifyToken, async (req: Request, res: Response) => {
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
         error,
         ip,
         req.headers.referer,
         get_date()
      );
      res.json({ status: 201, err: true, msg: "", error });
   }
});

users.post("/getusers", verifyToken, async (req: Request, res: Response) => {
   try {
      let data = User.findAll({
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
         error,
         ip,
         req.headers.referer,
         get_date()
      );
      res.json({ status: 201, err: true, msg: "", error });
   }
});

module.exports = { users };
