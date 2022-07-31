require("dotenv").config({ path: __dirname + "/.env" });
import express from "express";
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

const UserRout = require("./routes/UserRoutes");
const EmployeeRout = require("./routes/EmployeeRoutes");
const DepartmentRout = require("./routes/DepartmentRoutes");
const DeptManagersRout = require("./routes/DeptManagerRoutes");
const SalaryRout = require("./routes/SalaryRoutes");
const TitleRout = require("./routes/TitleRoutes");
const LogsRout = require("./routes/LogRoutes");

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
