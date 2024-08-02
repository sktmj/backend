import sql from 'mssql';

// Configuration for SKTPayroll database
export const sktPayrollConfig = {
  server: "192.168.50.30",
  database: "SKTPayroll",
  user: "sa",
  password: "ktm@werty123",
  options: {
    encrypt: false,
  },
};

// Configuration for daivel database
export const daivelConfig = {
  server: "192.168.50.30",
  database: "essl", // Ensure this is the correct database name
  user: "sa",
  password: "ktm@werty123",
  options: {
    encrypt: false,
  },
};

const pool = new sql.ConnectionPool(sktPayrollConfig);
const daivelPool = new sql.ConnectionPool(daivelConfig);

pool.connect()
  .then(() => {
    console.log("Connected to SKTPayroll SQL Server");
  })
  .catch((err) => {
    console.error("Error connecting to SKTPayroll SQL Server:", err);
  });

daivelPool.connect()
  .then(() => {
    console.log("Connected to daivel SQL Server");
  })
  .catch((err) => {
    console.error("Error connecting to daivel SQL Server:", err);
  });

export { pool, daivelPool };

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