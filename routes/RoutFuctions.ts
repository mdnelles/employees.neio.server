const jwt = require("jsonwebtoken");
const LogfnRF = require("../components/Logger");

const get_date = () => {
   let d: any = new Date();
   let month = parseInt(d.getMonth());
   month += 1;
   let tdate =
      d.getDate() +
      "-" +
      month +
      "-" +
      d.getFullYear() +
      " - " +
      d.getHours() +
      ":" +
      d.getMinutes() +
      " " +
      d.getSeconds();
   return tdate;
};

let ip = "0.0.0.0";
let tdate = get_date();
let fileName = __filename.split(/[\\/]/).pop();

const tokenTest = (token: any, res: any, jwt: any, caller: any, next: any) => {
   jwt.verify(token, process.env.SECRET_KEY, (err: any) => {
      if (err) {
         LogfnRF.log2db(
            500,
            fileName,
            "Token Test",
            "bad token",
            err,
            ip,
            caller,
            tdate
         );
         console.log(
            " /// " +
               caller +
               " failed -> token not verified: " +
               err +
               "\n==token=>" +
               token
         );
         // this will send forbidden 403 response
         res.sendStatus(403);
      } else {
         LogfnRF.log2db(
            200,
            fileName,
            "Token Test",
            "Token accepted",
            "",
            ip,
            caller,
            tdate
         );
         console.log("token ok caller -> " + caller);
         next(); // Next middleware
      }
   });
};

exports.verifyToken = function (req: any, res: any, next: any) {
   if (req.body.token !== undefined) {
      var caller = "";
      if (req.body.caller !== undefined) caller = req.body.caller;
      tokenTest(req.body.token, res, jwt, caller, next);
   } else {
      // attempt to extract xhr authorization from header as last resort

      if (req.headers.token !== undefined) {
         var token = req.headers.token;
         var caller = "";
         if (req.headers.caller !== undefined) caller = req.headers.caller;
         tokenTest(req.headers.token, res, jwt, caller, next);
      } else {
         console.log(
            "fail -> token == undefined | caller-> " +
               req.body.caller +
               " | token=" +
               req.body.token
         );
         res.sendStatus(403);
      }
   }
};
