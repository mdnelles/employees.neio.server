export const ip: string = "0.0.0.0";
export const getDate = () => {
   let d: Date = new Date();
   //ts-ignore
   let month: number = d.getMonth();
   month += 1;
   let tdate =
      d.getDate() +
      "-" +
      month +
      "-" +
      d.getFullYear() +
      " - " +
      d.getHours() +
      ":" +
      d.getMinutes() +
      " " +
      d.getSeconds();
   return tdate;
};
