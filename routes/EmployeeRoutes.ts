const expressER = require("express"),
   employee = expressER.Router(),
   bcryptER = require("bcrypt"),
   dbER = require("../database/db"),
   cors = require("cors"),
   SequelizeER = require("sequelize"),
   Employees = require("../models/Employees"),
   Salaries = require("../models/Salaries"),
   Logfn = require("../components/Logger"),
   rf = require("./RoutFuctions");
//const CircularJSON = require('flatted');

employee.use(cors());

let ipER = "0.0.0.0"; // install ip tracker
let tdateER = Logfn.get_date();
let fileNameER = __filename.split(/[\\/]/).pop();

employee.post("/add", rf.verifyToken, async (req: any, res: any) => {
   try {
      const { uuid, first_name, last_name, email, password } = req.body;
      var today = new Date();
      const employeeData = {
         uuid,
         first_name,
         last_name,
         email,
         password,
         created: today,
      };

      let employee = await Employees.findOne({
         where: {
            email: req.body.email,
            isdeleted: 0,
         },
      });

      if (!employee) {
         bcryptER.hash(password, 10, async (err: any, hash: any) => {
            employeeData.password = hash;
            employee = await Employees.create(employeeData);
            res.json({ status: 200, err: false, msg: "user exists", employee });
         });
      } else {
         res.json({ status: 200, err: true, msg: "user exists" });
      }
   } catch (error) {
      Logfn.log2db(
         500,
         fileNameER,
         "",
         "catch",
         error,
         ipER,
         req.headers.referer,
         tdateER
      );
      res.json({ status: 200, err: true, msg: "", error });
      console.log(error);
   }
});

employee.post("/edit", rf.verifyToken, async (req: any, res: any) => {
   try {
      const { id, first_name, last_name, email } = req.body;
      await Employees.update(
         {
            first_name,
            last_name,
            email,
         },
         { where: { id } },
         { limit: 1 }
      );
      res.json({ status: 200, err: false, msg: "user edited" });
   } catch (error) {
      Logfn.log2db(
         500,
         fileNameER,
         "",
         "catch",
         error,
         ipER,
         req.headers.referer,
         tdateER
      );
      res.json({ status: 200, err: true, msg: "catch", error });
      console.log(error);
   }
});

employee.post(
   "/remove_employee",
   rf.verifyToken,
   async (req: any, res: any) => {
      try {
         const { id } = req.body;
         await Employees.update(
            { isDeleted: 1 },
            { returning: true, where: { id } }
         );
         res.json({ status: 200, err: false, msg: "employee removed" });
      } catch (error) {
         Logfn.log2db(
            500,
            fileNameER,
            "remove_employee",
            "catch",
            error,
            ipER,
            req.headers.referer,
            tdateER
         );
         res.json({ status: 200, err: true, msg: "user exists", error });
      }
   }
);

employee.post("/get_employees", rf.verifyToken, async (req: any, res: any) => {
   try {
      const data = await Employees.findAll({ limit: 10000 });
      res.json({ status: 200, err: false, msg: "ok", data });
   } catch (error) {
      Logfn.log2db(
         500,
         fileNameER,
         "getemployees",
         "catch",
         error,
         ipER,
         req.headers.referer,
         tdateER
      );
      res.json({ status: 201, err: true, msg: "user exists", error });
   }
});

employee.post("/get_details", rf.verifyToken, async (req: any, res: any) => {
   try {
      const data1 = await Salaries.findAll({
         where: { emp_no: req.body.id },
      });

      let data2 = dbER.sequelize.query(
         `SELECT * FROM dept_emps  LEFT JOIN departments ON  dept_emps.dept_no=departments.dept_no WHERE dept_emps.emp_no= :emp_no`,
         {
            replacements: {
               emp_no: req.body.id,
            },
            type: SequelizeER.QueryTypes.SELECT,
         }
      );

      let obj = {
         departments: data2,
         salaries: data1,
      };

      res.json({ status: 200, err: false, msg: "ok", data: obj });
   } catch (error) {
      Logfn.log2db(
         500,
         fileNameER,
         "get_details",
         "catch",
         error,
         ipER,
         req.headers.referer,
         tdateER
      );
      res.json({ status: 200, err: true, msg: "", error });
      console.log(error);
   }
});

module.exports = { employee };
//module.exports = employee; //
//module.export = { myVar ... }
