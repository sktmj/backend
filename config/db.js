
import sql  from 'mssql';


 export const config = {
  server: "192.168.50.38\\DAIVELHO",
  database: "DAIVELP2P",
  user: "sa",
  password: "Admin@1234",
  options: {
    encrypt: false,
  },
};

const pool = new sql.ConnectionPool(config);
pool
  .connect()
  .then(() => {
    console.log("Connect to Sql server");
  })
  .catch((err) => {
    console.log("Error connecting to SQL Server:",err);
  });
export default pool;

// server : 192.168.50.38\DAIVELHO
// Database : DAIVELP2P

// Username : sa
// Password : Admin@1234


// export const config = {
//   server: "192.168.50.30",
//   database: "SKTPayroll",
//   user: "sa",
//   password: "ktm@werty123",
//   options: {
//     encrypt: false,
//   },
// };
