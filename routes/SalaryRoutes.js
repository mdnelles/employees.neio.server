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

salary.post('/get_salaries', rf.verifyToken, (req, res) => {
   console.log('SalaryRoutes.get_salaries');
   db.sequelize
      .query(
         `   SELECT s.emp_no, 
                    ANY_VALUE(salary) as any_salary,
                    e.first_name,
                    e.last_name
               FROM salaries as s
               JOIN employees AS e ON
                    s.emp_no=e.emp_no
                    GROUP BY s.emp_no
                    ORDER BY any_salary
               LIMIT 0, 500`,
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

module.exports = salary;
