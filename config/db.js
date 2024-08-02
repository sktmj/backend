import sql  from 'mssql';


 export const config = {
  server: "192.168.50.30",
  database: "SKTPayroll",
  user: "sa",
  password: "ktm@werty123",
  options: {
    encrypt: false,
  },
};

// Configuration for daivel database
const daivelConfig = {
  server: "192.168.50.30",
  database: "essl",
  user: "sa",
  password: "ktm@werty123",
  options: {
    encrypt: false,
  },
};


const pool = new sql.ConnectionPool(config);
const daivelPool = new sql.ConnectionPool(daivelConfig);

  pool
  .connect()
  .then(() => {
    console.log("Connect to Sql server");
  })
  .catch((err) => {
    console.log("Error connecting to SQL Server:",err);
  });
///////////////////////
  daivelPool
  .connect()
  .then(() => {
    console.log("Connected to daivel SQL Server");
  })
  .catch((err) => {
    console.log("Error connecting to daivel SQL Server:", err);
  });


  export {  pool, daivelPool };

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