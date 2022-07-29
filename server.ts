//import express, { Express, Request, Response } from 'express';

const express = require("express"),
   app = express(),
   corsSE: any = require("cors"),
   bodyParser = require("body-parser"),
   cookieParser = require("cookie-parser"),
   session = require("express-session"),
   port = process.env.PORT || 5007,
   path = require("path");

app.use(
   session({
      secret: process.env.NODE_SECRET,
      proxy: true,
      httpOnly: false,
      resave: process.env.NODE_COOKIE_RESAVE,
      saveUninitialized: process.env.NODE_COOKIE_SAVE_UNINITIALZED,
      cookie: {
         secure: false,
         httpOnly: false,
         path: "/",
      },
   })
);
app.use(corsSE());
// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(jsonParser);
app.use(urlencodedParser);

var UserRout = require("./routes/UserRoutes"),
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

// serve static assets if in production
if (process.env.NODE_ENV === "production") {
   // set static folder
   app.use(express.static("client/build"));

   app.get("*", (req: any, res: any) => {
      res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
   });
}

app.listen(port, function () {
   console.log("Server is running on port: " + port);
});
