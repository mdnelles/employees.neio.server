import bcrypt from "bcrypt";
import { add, remove, list, details } from "../routes/EmployeeRoutes";
import { Employees } from "../models/Employees";
import { Salarie } from "../models/Salaries";
import { db } from "../database/db";

// Mock bcrypt
jest.mock("bcrypt", () => ({
   hash: jest.fn((password, salt, callback) =>
      callback(null, "hashedPassword")
   ),
}));

// Mock Employees model
jest.mock("../models/Employees", () => ({
   findOne: jest.fn(),
   create: jest.fn(),
   update: jest.fn(),
}));

// Mock Salarie model
jest.mock("../models/Salaries", () => ({
   findAll: jest.fn(),
}));

// Mock db module
jest.mock("../database/db", () => ({
   db: {
      sequelize: {
         query: jest.fn(),
      },
   },
}));

// Mock log2db, db, ip, and getDate functions

describe("Employees Tests", () => {
   afterEach(() => {
      jest.clearAllMocks();
   });

   // Test for the "add" function
   it("should add a new employee", async () => {
      // Mock request and response objects
      const req = {
         body: {
            uuid: "123",
            first_name: "John",
            last_name: "Doe",
            email: "johndoe@example.com",
            password: "password",
         },
      };
      const res = {
         json: jest.fn(),
      };

      // Mock the employee data and the created employee instance
      const employeeData = {
         uuid: "123",
         first_name: "John",
         last_name: "Doe",
         email: "johndoe@example.com",
         password: "hashedPassword",
         created: expect.any(Date),
      };
      const createdEmployee = { id: 1, ...employeeData };

      // Mock the "findOne" function to return null (employee does not exist)
      Employees.findOne.mockResolvedValue(null);

      // Mock the "create" function to return the created employee
      Employees.create.mockResolvedValue(createdEmployee);

      await add(req, res);

      expect(Employees.findOne).toHaveBeenCalledWith({
         where: {
            email: req.body.email,
            isdeleted: 0,
         },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(
         req.body.password,
         10,
         expect.any(Function)
      );
      expect(Employees.create).toHaveBeenCalledWith(employeeData);
      expect(res.json).toHaveBeenCalledWith({
         status: 200,
         err: false,
         msg: "user exists",
         employee: createdEmployee,
      });
   });

   // Test for the "edit" function
   it("should remove an employee", async () => {
      // Mock request and response objects
      const req = {
         body: {
            id: 1,
         },
      };
      const res = {
         json: jest.fn(),
      };

      await remove(req, res);

      expect(Employees.update).toHaveBeenCalledWith(
         { isDeleted: 1 },
         { returning: true, where: { id: req.body.id } }
      );
      expect(res.json).toHaveBeenCalledWith({
         status: 200,
         err: false,
         msg: "employee removed",
      });
   });

   // Test for the "list" function
   it("should return a list of employees", async () => {
      // Mock request and response objects
      const req = {};
      const res = {
         json: jest.fn(),
      };

      // Mock the SQL query result
      const sqlResult = [
         {
            emp_no: 1,
            birth_date: "1990-01-01",
            first_name: "John",
            last_name: "Doe",
            gender: "M",
            hire_date: "2020-01-01",
            dept_no: "DEPT001",
            title: "Manager",
         },
         // More data...
      ];

      // Mock the Sequelize query function to return the SQL result
      db.sequelize.query.mockResolvedValue([sqlResult]);

      await list(req, res);

      expect(db.sequelize.query).toHaveBeenCalledWith(expect.any(String));
      expect(res.json).toHaveBeenCalledWith({
         status: 200,
         err: false,
         msg: "ok",
         data: sqlResult,
      });
   });

   // Test for the "details" function
   it("should return details of an employee", async () => {
      // Mock request and response objects
      const req = {
         body: {
            emp_no: 1,
         },
      };
      const res = {
         json: jest.fn(),
      };

      // Mock the Salarie and dept_emps data
      const salarieData = [{ emp_no: 1, salary: 50000 }];
      const deptEmpsData = [
         { emp_no: 1, dept_no: "DEPT001", dept_name: "Department 1" },
      ];

      // Mock the Salarie model to return the salarieData
      Salarie.findAll.mockResolvedValue(salarieData);

      // Mock the Sequelize query function to return the deptEmpsData
      db.sequelize.query.mockResolvedValue(deptEmpsData);

      await details(req, res);

      expect(Salarie.findAll).toHaveBeenCalledWith({
         where: { emp_no: req.body.emp_no },
      });
      expect(db.sequelize.query).toHaveBeenCalledWith(
         expect.any(String),
         expect.objectContaining({
            replacements: { emp_no: req.body.emp_no },
         })
      );
      expect(res.json).toHaveBeenCalledWith({
         status: 200,
         err: false,
         msg: "ok",
         data: { departments: deptEmpsData, salaries: salarieData },
      });
   });
});
