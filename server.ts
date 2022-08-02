require("dotenv").config({ path: . + "/.env" });

import express from "express";
import path from "node:path";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const app = express();
const port = process.env.NODE_PORT || 5010;

app.use(cors());
app.use(express.json());
var jsonParser = bodyParser.json();
app.use(jsonParser);
app.use(urlencodedParser);
app.use(helmet());

import { verifyToken, verifyTokenAdmin } from "./components/RoutFuctions";

import * as users from "./routes/UserRoutes";
import * as employees from "./routes/EmployeeRoutes";
import * as department from "./routes/DepartmentRoutes";
import * as dept_manager from "./routes/DeptManagerRoutes";
import * as salary from "./routes/SalaryRoutes";
import * as title from "./routes/TitleRoutes";
import * as logs from "./routes/LogRoutes";

//app.use("/user", users);
app.post("/users_register", users.register);
app.post("/users_edit", verifyTokenAdmin, users.register);
app.post("/users_delete", verifyTokenAdmin, users.del);
app.post("/users_list", verifyTokenAdmin, users.list);
app.post("/users_login", users.login);

app.use("/employee", EmployeeRout);
app.use("/department", DepartmentRout);
app.use("/dept_manager", DeptManagersRout);
app.use("/salary", SalaryRout);
app.use("/titles", TitleRout);
app.use("/logs", LogsRout);





if (process.env.NODE_ENV === "production") {
   // set static folder
   app.use(express.static("client/build"));
}

app.listen(port, function () {
   console.log("Server is running on port: " + port);
});
