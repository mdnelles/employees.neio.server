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
   console.log('SalaryRoutes.get_salaries' + req.body);
   let low = req.body.salaryRange;
   let high = low + 2499;
   db.sequelize
      .query(
         ` SELECT s.emp_no, 
                    ANY_VALUE(salary) as any_salary,
                    ANY_VALUE(from_date) as any_start,
                    ANY_VALUE(to_date) as any_finish,
                    e.first_name,
                    e.last_name
               FROM salaries as s
               JOIN employees AS e ON
                    s.emp_no=e.emp_no
                    WHERE s.salary > :low 
                    AND s.salary < :high
                    GROUP BY s.emp_no
               LIMIT 2000`,
         {
            replacements: {
               low: low,
               high: high,
            },
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
