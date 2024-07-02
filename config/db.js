
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


