import { Logs } from "../models/Logs";

const log2db = (
   code: number,
   filename: string | undefined,
   fnction: string,
   msg_programmer: string,
   msg_app: string | undefined,
   ip: string,
   refer: string | undefined,
   tdate: string
) => {
   console.log(">log2db: " + msg_app);
   if (!msg_app) {
      msg_app = "N/A";
   } else {
      msg_app = msg_app
         .toString()
         .replace(/"/g, "``")
         .replace(/'/g, "`");
   }

   msg_app = msg_app.toString().substring(0, 250);
   if (typeof msg_app && msg_app !== undefined)
      msg_app = JSON.stringify(msg_app);
   msg_app = msg_app.substring(0, 499);
   const logData = {
      code,
      filename,
      fnction,
      msg_programmer,
      msg_app,
      ip,
      refer,
      tdate,
   };
   Logs.create(logData);
   return true;
};
export default log2db;
