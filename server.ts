import express from "express";
const app = express();
import cors from "cors";
import helmet from "helmet";

const port = process.env.NODE_PORT || 5010;

app.use(cors());
app.use(express.json());
app.use(helmet());

const UserRout = require("./routes/UserRoutes"),
   EmployeeRout = require("./routes/EmployeeRoutes"),
   DepartmentRout = require("./routes/DepartmentRoutes"),
   DeptManagersRout = require("./routes/DeptManagerRoutes"),
   SalaryRout = require("./routes/SalaryRoutes"),
   TitleRout = require("./routes/TitleRoutes"),
   LogsRout = require("./routes/LogRoutes");

app.use("/user", UserRout);
app.use("/logs", LogsRout);
app.use("/employee", EmployeeRout);
app.use("/department", DepartmentRout);
app.use("/salary", SalaryRout);
app.use("/titles", TitleRout);
app.use("/dept_manager", DeptManagersRout);

if (process.env.NODE_ENV === "production") {
   // set static folder
   app.use(express.static("client/build"));
}

app.listen(port, function () {
   console.log("Server is running on port: " + port);
});
