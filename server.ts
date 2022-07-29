//app.use('/admin', adminRouter); before app.use(express.json());

import express, { Request, Response } from "express";
const app = express();
import cors from "cors";

const port = process.env.NODE_PORT || 5010;

const UserRout = require("./routes/UserRoutes"),
   EmployeeRout = require("./routes/EmployeeRoutes"),
   DepartmentRout = require("./routes/DepartmentRoutes"),
   DeptManagersRout = require("./routes/DeptManagerRoutes"),
   //Dba = require("./routes/DbaRoutes"),
   SalaryRout = require("./routes/SalaryRoutes"),
   TitleRout = require("./routes/TitleRoutes"),
   LogsRout = require("./routes/LogRoutes");

app.use("/user", UserRout);
//app.use("/dba", DbaRout);
app.use("/logs", LogsRout);
app.use("/employee", EmployeeRout);
app.use("/department", DepartmentRout);
app.use("/salary", SalaryRout);
app.use("/titles", TitleRout);
app.use("/dept_manager", DeptManagersRout);

app.use(cors());
app.use(express.json());

// serve static assets if in production
if (process.env.NODE_ENV === "production") {
   // set static folder
   app.use(express.static("client/build"));
}

app.listen(port, function () {
   console.log("Server is running on port: " + port);
});
