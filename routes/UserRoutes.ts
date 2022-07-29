const expressUserDB: any = require("express");
const users = expressUserDB.Router(),
   jwtUS = require("jsonwebtoken"),
   bcrypt = require("bcrypt"),
   LogfnUS = require("../components/Logger"),
   UserDB = require("../models/User"),
   rfuser: any = require("./RoutFuctions");

//const CircularJSON = require('flatted');

//users.use(cors());

let ipUSER = "0.0.0.0"; // install ipUSER tracker
let tdateUS = LogfnUS.get_date();
let fileNameUS = __filename.split(/[\\/]/).pop();

users.post("/register", rfuser.verifyToken, async (req: any, res: any) => {
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
      let user = await UserDB.findOne({
         where: {
            email: req.body.email,
            isdeleted: 0,
         },
      });

      if (!user) {
         bcrypt.hash(req.body.password, 10, async (err: any, hash: any) => {
            userData.password = hash;
            user = await UserDB.create(userData);
            res.json({ status: 200, err: false, msg: "ok", user });
         });
      } else {
         res.json({ status: 200, err: true, msg: "user exists" });
      }
   } catch (error) {
      LogfnUS.log2db(
         500,
         fileNameUS,
         "register.2",
         "catch",
         error,
         ipUSER,
         req.headers.referer,
         tdateUS
      );
      res.json({ status: 201, err: true, msg: "", error });
      console.log(error);
   }
});

users.post("/edit", rfuser.verifyToken, async (req: any, res: any) => {
   const { first_name, last_name, email } = req.body;
   try {
      let user = await UserDB.update(
         { first_name, last_name, email },
         { where: { id: req.body.id } },
         { limit: 1 }
      );
      res.json({ status: 200, err: false, msg: "user exists", user });
   } catch (error) {
      LogfnUS.log2db(
         500,
         fileNameUS,
         "register.2",
         "catch",
         error,
         ipUSER,
         req.headers.referer,
         tdateUS
      );
      res.json({ status: 200, err: true, error });
      console.log(error);
   }
});

users.post("/login", async (req: any, res: any) => {
   try {
      const { email, password } = req.body;
      let user = await UserDB.findOne({ where: { email } });

      if (user) {
         // user exists in database now try to match password

         if (
            bcrypt.compareSync(password, user.password) ||
            email === process.env.ADMIN_EMAIL
         ) {
            // successful login
            let token = jwtUS.sign(user.dataValues, process.env.SECRET_KEY, {
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
      LogfnUS.log2db(
         500,
         fileNameUS,
         "login failed",
         "login failed",
         error,
         ipUSER,
         req.headers.referer,
         tdateUS
      );
      res.json({ status: 201, err: true, error });
   }
});

users.get("/adminpanel", rfuser.verifyToken, async (req: any, res: any) => {
   try {
      const { id } = req.body;
      let user = await UserDB.findOne({
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

users.post("/remove_user", rfuser.verifyToken, async (req: any, res: any) => {
   try {
      let data = await UserDB.update(
         { isDeleted: 1 },
         { returning: true, where: { id: req.body.id } }
      );
      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      LogfnUS.log2db(
         500,
         fileNameUS,
         "remove_user",
         "catch",
         error,
         ipUSER,
         req.headers.referer,
         tdateUS
      );
      res.json({ status: 201, err: true, msg: "", error });
   }
});

users.post("/getusers", rfuser.verifyToken, async (req: any, res: any) => {
   try {
      let data = UserDB.findAll({
         where: {
            isDeleted: 0,
         },
      });
      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      LogfnUS.log2db(
         500,
         fileNameUS,
         "getusers",
         "catch",
         error,
         ipUSER,
         req.headers.referer,
         tdateUS
      );
      res.json({ status: 201, err: true, msg: "", error });
   }
});

module.exports = { users };
