declare module "express";
declare namespace Express {
   export interface Request {
      uuid: any;
   }
   export interface Response {
      uuid: any;
   }
}
