const express = require('express'),
   employee = express.Router(),
   cors = require('cors'),
   jwt = require('jsonwebtoken'),
   bcrypt = require('bcrypt'),
   path = require('path'),
   Employees = require('../models/Employees'),
   Logfn = require('../components/Logger'),
   rf = require('./RoutFuctions');
//const CircularJSON = require('flatted');

employee.use(cors());

let ip = '0.0.0.0'; // install ip tracker
let tdate = Logfn.get_date();
let fileName = __filename.split(/[\\/]/).pop();

employee.post('/add', rf.verifyToken, (req, res) => {
   var today = new Date();
   const employeeData = {
      uuid: req.body.uuid,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
      created: today
   };

   Employees.findOne({
      where: {
         email: req.body.email,
         isdeleted: 0
      }
   })
      //TODO bcrypt
      .then((employee) => {
         if (!employee) {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
               employeeData.password = hash;
               Employees.create(employeeData)
                  .then((employee) => {
                     res.status(200)
                        .json({ status: employee.email + 'Registered!' })
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
                        error: 'An error occurred please contact the admin'
                     }).end();
                     console.log(
                        'Err (catch) /EmployeeRoutes/register: ' + err
                     );
                  });
            });
         } else {
            res.json({ error: 'Employee already exists' }).end();
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
            error: 'An error occurred please contact the admin'
         }).end();
         console.log('Err #116: ' + err);
      });
});

employee.post('/edit', rf.verifyToken, (req, res) => {
   Employees.update(
      {
         first_name: req.body.first_name,
         last_name: req.body.last_name,
         email: req.body.email
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
            error: 'An error occurred please contact the admin'
         }).end();
         console.log(`error trying to update admin employee:  : ` + err);
      });
});

employee.post('/remove_employee', rf.verifyToken, (req, res) => {
   console.log('req.body.theUuid = ' + JSON.stringify(req.body.id));
   Employees.update(
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
            'remove_employee',
            'catch',
            err,
            ip,
            req.headers.referer,
            tdate
         );
         id;
         console.log(
            'Client Error @ EmployeeFunctions > remove_employee' + err
         );
         res.status(404)
            .send('Error Location 101')
            .end();
      });
});

employee.post('/get_employees', rf.verifyToken, (req, res) => {
   Employees.findAll()
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
         console.log('Client Error @ EmployeeFunctions > get_employees' + err);
         res.status(404)
            .send('Error Location 102')
            .end();
      });
});

employee.post('/islogged', rf.verifyToken, (req, res) => {
   res.status(200)
      .json(true)
      .end();
   // if false rf.verifyToken will send response -> res.status(403)
});

module.exports = employee;
