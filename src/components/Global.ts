export const ip = "0.0.0.0";
export const getDate = () => {
   const d: Date = new Date();
   //ts-ignore
   let month: number = d.getMonth();
   month += 1;
   const tdate =
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
