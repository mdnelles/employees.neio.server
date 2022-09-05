import express from "express";

//const express = require("express");
import compression from "compression";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
/* eslint-disable */
const env = require("dotenv").config().parsed;

import { verifyToken, verifyTokenAdmin } from "./components/RoutFuctions";

import * as users from "./routes/UserRoutes";
import * as employees from "./routes/EmployeeRoutes";
import * as department from "./routes/DepartmentRoutes";
import * as dept_manager from "./routes/DeptManagerRoutes";
import * as salary from "./routes/SalaryRoutes";
import * as title from "./routes/TitleRoutes";
import * as logs from "./routes/LogRoutes";
import * as basic from "./routes/Basic";

const urlencodedParser = bodyParser.urlencoded({ extended: false });
const app = express();
const jsonParser = bodyParser.json();
const port = env.NODE_PORT || 5020;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
/*app.use(
   session({
      resave: false,
      saveUninitialized: true,
      secret: env.NODE_SECRET,
   })
);*/
app.use(compression());
app.use(express.json());
app.use(jsonParser);
app.use(urlencodedParser);
app.use(helmet());

//app.use("/user", users);
app.post("/users_register", users.register);
app.post("/users_edit", verifyTokenAdmin, users.register);
app.post("/users_delete", verifyTokenAdmin, users.del);
app.post("/users_list", verifyTokenAdmin, users.list);
app.post("/users_login", users.login);

app.post("/emp_add", verifyTokenAdmin, employees.add);
app.post("/emp_edit", verifyTokenAdmin, employees.edit);
app.post("/emp_remove", verifyTokenAdmin, employees.remove);
app.post("/emp_list", verifyTokenAdmin, employees.list);
app.post("/emp_details", verifyToken, employees.details);

app.post("/dept_search", verifyToken, department.search);
app.post("/dept_edit", verifyTokenAdmin, department.edit);
app.post("/dept_remove", verifyToken, department.remove_department);
app.post("/dept_get_emp_by", verifyToken, department.get_emp_by_depo);
app.post("/dept_details", verifyToken, department.get_details);
app.post("/dept_list", verifyToken, department.get_departments);

app.post("/depman_add", verifyTokenAdmin, dept_manager.add);
app.post("/depman_edit", verifyTokenAdmin, dept_manager.edit);
app.post("/depman_rm_man", verifyTokenAdmin, dept_manager.rem_manager);
app.post("/depman_list", verifyToken, dept_manager.list);
app.post("/depman_get_emp_v_man", verifyToken, dept_manager.get_emp_v_depo);
app.post("/depman_details", verifyToken, dept_manager.details);

app.post("/salary_list", verifyToken, salary.list);

app.post("/title_rem", verifyTokenAdmin, title.remove);
app.post("/title_list", verifyToken, title.list);
app.post("/title_details", verifyTokenAdmin, title.details);

app.post("/logs_list", verifyToken, logs.list);
app.post("/logs_get_count", verifyToken, logs.get_count);

app.post("/basic_api", verifyToken, basic.api);
app.post("/schemas", verifyToken, basic.schemas);
app.post("/tables", verifyToken, basic.tables);

if (env.NODE_ENV === "production") {
   // set static folder
   app.use(express.static("client/build"));
}

app.listen(port, function() {
   console.log("Server is running on port: " + port);
});

export default app;
