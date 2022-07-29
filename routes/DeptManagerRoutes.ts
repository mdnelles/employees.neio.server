const express = require("express"),
   dept_manager = express.Router(),
   cors = require("cors"),
   bcrypt = require("bcrypt"),
   db = require("../database/db"),
   Sequelize = require("sequelize"),
   DeptManagers = require("../models/DeptManager"),
   Salaries = require("../models/Salaries"),
   Logfn = require("../components/Logger"),
   rf = require("./RoutFuctions");
//const CircularJSON = require('flatted');

dept_manager.use(cors());

let ip = "0.0.0.0"; // install ip tracker
let tdate = Logfn.get_date();
let fileName = __filename.split(/[\\/]/).pop();

dept_manager.post("/add", rf.verifyToken, (req: any, res: any) => {
   var today = new Date();
   const dept_managerData = {
      uuid: req.body.uuid,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
      created: today,
   };

   DeptManagers.findOne({
      where: {
         email: req.body.email,
         isdeleted: 0,
      },
   })
      //TODO bcrypt
      .then((dept_manager) => {
         if (!dept_manager) {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
               dept_managerData.password = hash;
               DeptManagers.create(dept_managerData)
                  .then((dept_manager) => {
                     res.status(200)
                        .json({ status: dept_manager.email + "Registered!" })
                        .end();
                  })
                  .catch((err) => {
                     Logfn.log2db(
                        500,
                        fileName,
                        "register.1",
                        "catch",
                        err,
                        ip,
                        req.headers.referer,
                        tdate
                     );
                     res.json({
                        error: "An error occurred please contact the admin",
                     }).end();
                     console.log(
                        "Err (catch) /DeptManagerRoutes/register: " + err
                     );
                  });
            });
         } else {
            res.json({ error: "DeptManager already exists" }).end();
         }
      })
      .catch((err) => {
         Logfn.log2db(
            500,
            fileName,
            "register.2",
            "catch",
            err,
            ip,
            req.headers.referer,
            tdate
         );
         res.json({
            error: "An error occurred please contact the admin",
         }).end();
         console.log("Err #116: " + err);
      });
});

dept_manager.post("/edit", rf.verifyToken, (req: any, res: any) => {
   DeptManagers.update(
      {
         first_name: req.body.first_name,
         last_name: req.body.last_name,
         email: req.body.email,
      },
      { where: { id: req.body.id } },
      { limit: 1 }
   )

      .then(() => {
         res.send(200).end();
      })
      .catch((err) => {
         Logfn.log2db(
            500,
            fileName,
            "register.2",
            "catch",
            err,
            ip,
            req.headers.referer,
            tdate
         );
         res.json({
            error: "An error occurred please contact the admin",
         }).end();
         console.log(`error trying to update admin dept_manager:  : ` + err);
      });
});

dept_manager.post(
   "/remove_dept_manager",
   rf.verifyToken,
   (req: any, res: any) => {
      console.log("req.body.theUuid = " + JSON.stringify(req.body.id));
      DeptManagers.update(
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
               "remove_dept_manager",
               "catch",
               err,
               ip,
               req.headers.referer,
               tdate
            );
            id;
            console.log(
               "Client Error @ DeptManagerFunctions > remove_dept_manager" + err
            );
            res.status(404).send("Error Location 101").end();
         });
   }
);

dept_manager.post(
   "/get_dept_managers",
   rf.verifyToken,
   (req: any, res: any) => {
      db.sequelize
         .query(
            `SELECT 
         dept_managers.from_date, 
         dept_managers.to_date, 
         departments.dept_name, 
         departments.dept_no, 
         employees.first_name, 
         employees.last_name, 
         employees.emp_no 
       FROM dept_managers 
       JOIN departments on 
         departments.dept_no=dept_managers.dept_no
       LEFT JOIN employees on 
         employees.emp_no=dept_managers.emp_no 
       `,
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
               "getdept_managers",
               "catch",
               err,
               ip,
               req.headers.referer,
               tdate
            );
            console.log(
               "Client Error @ DeptManagerFunctions > get_dept_managers" + err
            );
            res.status(404).send("Error Location 102").end();
         });
   }
);

dept_manager.post(
   "/get_employees_by_dept",
   rf.verifyToken,
   (req: any, res: any) => {
      db.sequelize
         .query(
            `SELECT 
         dept_managers.from_date, 
         dept_managers.to_date, 
         departments.dept_name, 
         employees.first_name, 
         employees.last_name, 
         employees.emp_no 
       FROM dept_managers 
       JOIN departments on 
         departments.dept_no=dept_managers.dept_no
       LEFT JOIN employees on 
         employees.emp_no=dept_managers.emp_no 
       `,
            {
               replacements: {
                  dept_no: req.body.dept_no,
               },
               type: Sequelize.QueryTypes.SELECT,
            }
         )
         .then((data) => {
            //console.log(data)
            res.send(data);
         })
         .catch((err) => {
            Logfn.log2db(
               500,
               fileName,
               "getemployees",
               "catch",
               err,
               ip,
               req.headers.referer,
               tdate
            );
            console.log(
               "Client Error @ DepartmnetRoutes.get_employees_by_dept" + err
            );
            res.status(404)
               .send("DepartmnetRoutes.get_employees_by_dept")
               .end();
         });
   }
);

dept_manager.post("/get_details", rf.verifyToken, (req: any, res: any) => {
   Salaries.findAll({
      where: { emp_no: req.body.id },
   })
      .then((data1) => {
         db.sequelize
            .query(
               `SELECT * FROM dept_emps  LEFT JOIN dept_managers ON  dept_emps.dept_no=dept_managers.dept_no WHERE dept_emps.emp_no= :emp_no`,
               {
                  replacements: {
                     emp_no: req.body.id,
                  },
                  type: Sequelize.QueryTypes.SELECT,
               }
            )
            .then((data2) => {
               let obj = {
                  dept_managers: data2,
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
                  "Client Error @ DeptManagerFunctions > get_details 2" + err
               );
               res.status(404)
                  .send("Server Error @ DeptManagerFunctions > get_details 2")
                  .end();
            });
      })
      .catch((err) => {
         console.log(
            "Server Error @ DeptManagerFunctions > get_details 1 " + err
         );
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
            .send("Server Error @ DeptManagerFunctions > get_details 1")
            .end();
      });
});

dept_manager.post("/islogged", rf.verifyToken, (req: any, res: any) => {
   res.status(200).json(true).end();
   // if false rf.verifyToken will send response -> res.status(403)
});

module.exports = { dept_manager };
