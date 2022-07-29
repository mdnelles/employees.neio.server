const express = require("express"),
   title = express.Router(),
   cors = require("cors"),
   bcrypt = require("bcrypt"),
   db = require("../database/db"),
   Sequelize = require("sequelize"),
   Titles = require("../models/Titles"),
   Salaries = require("../models/Salaries"),
   Logfn = require("../components/Logger"),
   rf = require("./RoutFuctions");
//const CircularJSON = require('flatted');

title.use(cors());

let ip = "0.0.0.0"; // install ip tracker
let tdate = Logfn.get_date();

title.post("/remove_title", rf.verifyToken, (req: any, res: any) => {
   console.log("req.body.theUuid = " + JSON.stringify(req.body.id));
   Titles.update(
      { isDeleted: 1 },
      { returning: true, where: { id: req.body.id } }
   )
      .then((data) => {
         res.send(data).end();
      })
      .catch((err) => {
         Logfn.log2db(
            500,
            fileName,
            "remove_title",
            "catch",
            err,
            ip,
            req.headers.referer,
            tdate
         );
         id;
         console.log("Client Error @ TitleFunctions > remove_title" + err);
         res.status(404).send("Error Location 101").end();
      });
});

title.post("/get_titles", rf.verifyToken, (req: any, res: any) => {
   console.log("TitleRoutes.get_titles");
   db.sequelize
      .query(
         `select titles.title from employees.titles group by titles.title`,
         {
            type: Sequelize.QueryTypes.SELECT,
         }
      )
      .then((data) => {
         res.send(data);
      })

      .catch((err) => {
         Logfn.log2db(
            500,
            fileName,
            "gettitles",
            "catch",
            err,
            ip,
            req.headers.referer,
            tdate
         );
         console.log("Client Error @ TitleFunctions > get_titles" + err);
         res.status(404).send("Error Location 102").end();
      });
});

title.post("/get_details", rf.verifyToken, (req: any, res: any) => {
   Salaries.findAll({
      where: { emp_no: req.body.id },
   })
      .then((data1) => {
         db.sequelize
            .query(
               `SELECT * FROM dept_emps  LEFT JOIN titles ON  dept_emps.dept_no=titles.dept_no WHERE dept_emps.emp_no= :emp_no`,
               {
                  replacements: {
                     emp_no: req.body.id,
                  },
                  type: Sequelize.QueryTypes.SELECT,
               }
            )
            .then((data2) => {
               let obj = {
                  titles: data2,
                  salaries: data1,
               };

               res.send(obj);
            })
            .catch((err) => {
               Logfn.log2db(
                  500,
                  fileName,
                  "get_details",
                  "catch",
                  err,
                  ip,
                  req.headers.referer,
                  tdate
               );
               console.log(
                  "Client Error @ TitleFunctions > get_details 2" + err
               );
               res.status(404)
                  .send("Server Error @ TitleFunctions > get_details 2")
                  .end();
            });
      })
      .catch((err) => {
         console.log("Server Error @ TitleFunctions > get_details 1 " + err);
         Logfn.log2db(
            500,
            fileName,
            "get_details",
            "catch",
            err,
            ip,
            req.headers.referer,
            tdate
         );
         res.status(404)
            .send("Server Error @ TitleFunctions > get_details 1")
            .end();
      });
});

title.post("/islogged", rf.verifyToken, (req: any, res: any) => {
   res.status(200).json(true).end();
   // if false rf.verifyToken will send response -> res.status(403)
});

module.exports = { title };
