const express = require('express'),
   salary = express.Router(),
   cors = require('cors'),
   bcrypt = require('bcrypt'),
   db = require('../database/db'),
   Sequelize = require('sequelize'),
   Salaries = require('../models/Salaries'),
   Logfn = require('../components/Logger'),
   rf = require('./RoutFuctions');
//const CircularJSON = require('flatted');

salary.use(cors());

let ip = '0.0.0.0'; // install ip tracker
let tdate = Logfn.get_date();
let fileName = __filename.split(/[\\/]/).pop();

salary.post('/add', rf.verifyToken, (req, res) => {
   var today = new Date();
   const salaryData = {
      uuid: req.body.uuid,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
      created: today,
   };

   Salarie.findOne({
      where: {
         email: req.body.email,
         isdeleted: 0,
      },
   })
      //TODO bcrypt
      .then((salary) => {
         if (!salary) {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
               salaryData.password = hash;
               Salarie.create(salaryData)
                  .then((salary) => {
                     res.status(200)
                        .json({ status: salary.email + 'Registered!' })
                        .end();
                  })
                  .catch((err) => {
                     Logfn.log2db(
                        500,
                        fileName,
                        'register.1',
                        'catch',
                        err,
                        ip,
                        req.headers.referer,
                        tdate
                     );
                     res.json({
                        error: 'An error occurred please contact the admin',
                     }).end();
                     console.log('Err (catch) /SalaryRoutes/register: ' + err);
                  });
            });
         } else {
            res.json({ error: 'Salary already exists' }).end();
         }
      })
      .catch((err) => {
         Logfn.log2db(
            500,
            fileName,
            'register.2',
            'catch',
            err,
            ip,
            req.headers.referer,
            tdate
         );
         res.json({
            error: 'An error occurred please contact the admin',
         }).end();
         console.log('Err #116: ' + err);
      });
});

salary.post('/edit', rf.verifyToken, (req, res) => {
   Salarie.update(
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
            'register.2',
            'catch',
            err,
            ip,
            req.headers.referer,
            tdate
         );
         res.json({
            error: 'An error occurred please contact the admin',
         }).end();
         console.log(`error trying to update admin salary:  : ` + err);
      });
});

salary.post('/remove_salary', rf.verifyToken, (req, res) => {
   console.log('req.body.theUuid = ' + JSON.stringify(req.body.id));
   Salarie.update(
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
            'remove_salary',
            'catch',
            err,
            ip,
            req.headers.referer,
            tdate
         );
         id;
         console.log('Client Error @ SalaryFunctions > remove_salary' + err);
         res.status(404).send('Error Location 101').end();
      });
});

salary.post('/get_salarys', rf.verifyToken, (req, res) => {
   console.log('SalaryRoutes.get_ssalarys');
   Salarie.findAll({ limit: 1000 })
      .then((data) => {
         res.send(data);
      })
      .catch((err) => {
         Logfn.log2db(
            500,
            fileName,
            'getsalarys',
            'catch',
            err,
            ip,
            req.headers.referer,
            tdate
         );
         console.log('Client Error @ SalaryFunctions > get_salarys' + err);
         res.status(404).send('Error Location 102').end();
      });
});

salary.post('/get_employees_by_dept', rf.verifyToken, (req, res) => {
   db.sequelize
      .query(
         `SELECT * FROM dept_emps  LEFT JOIN employees ON  dept_emps.emp_no=employees.emp_no WHERE dept_emps.dept_no= :dept_no LIMIT 250`,
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
            'getemployees',
            'catch',
            err,
            ip,
            req.headers.referer,
            tdate
         );
         console.log(
            'Client Error @ DepartmnetRoutes.get_employees_by_dept' + err
         );
         res.status(404).send('DepartmnetRoutes.get_employees_by_dept').end();
      });
});

salary.post('/get_details', rf.verifyToken, (req, res) => {
   Salaries.findAll({
      where: { emp_no: req.body.id },
   })
      .then((data1) => {
         db.sequelize
            .query(
               `SELECT * FROM dept_emps  LEFT JOIN salarys ON  dept_emps.dept_no=salarys.dept_no WHERE dept_emps.emp_no= :emp_no`,
               {
                  replacements: {
                     emp_no: req.body.id,
                  },
                  type: Sequelize.QueryTypes.SELECT,
               }
            )
            .then((data2) => {
               let obj = {
                  salarys: data2,
                  salaries: data1,
               };

               res.send(obj);
            })
            .catch((err) => {
               Logfn.log2db(
                  500,
                  fileName,
                  'get_details',
                  'catch',
                  err,
                  ip,
                  req.headers.referer,
                  tdate
               );
               console.log(
                  'Client Error @ SalaryFunctions > get_details 2' + err
               );
               res.status(404)
                  .send('Server Error @ SalaryFunctions > get_details 2')
                  .end();
            });
      })
      .catch((err) => {
         console.log('Server Error @ SalaryFunctions > get_details 1 ' + err);
         Logfn.log2db(
            500,
            fileName,
            'get_details',
            'catch',
            err,
            ip,
            req.headers.referer,
            tdate
         );
         res.status(404)
            .send('Server Error @ SalaryFunctions > get_details 1')
            .end();
      });
});

salary.post('/islogged', rf.verifyToken, (req, res) => {
   res.status(200).json(true).end();
   // if false rf.verifyToken will send response -> res.status(403)
});

module.exports = salary;
