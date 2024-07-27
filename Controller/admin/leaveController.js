import sql from "mssql";
import pool from "../../config/db.js";
 


export const employeIdcontroller = async (req,res)=>{
    // Logic to fetch districts by state ID from the database
    const { EmployeeId } = req.params;
    pool
      .request()
      .input("EmployeeId", sql.Int, EmployeeId)
      .query("SELECT EmployeeId,Name + '-' + BiometricCode as Employee FROM EmployeeMaster  WHERE EmployeeId = @EmployeeId") // Check if the column name is correct (EmployeeId)
      .then((result) => {
        res.json(result.recordset);
      })
      .catch((err) => {
        console.error("Error fetching employeId:", err);
        res.status(500).json({ error: "Error fetching employeId" });
      });
  };
  
  
  
  export const OrganisationController = async (req,res)=>{
    // Logic to fetch districts by state ID from the database
    const { EmployeeId } = req.params;
    pool
      .request()
      .input("EmployeeId", sql.Int, EmployeeId)
      .query("SELECT FAC.FactoryName as Factory,FAC.FactoryId FROM EmployeeMaster EMP INNER JOIN FactoryMaster FAC ON  EMP.FactoryId=FAC.FactoryId  WHERE EmployeeId = @EmployeeId") // Check if the column name is correct (EmployeeId)
      .then((result) => {
        res.json(result.recordset);
      })
      .catch((err) => {
        console.error("Error fetching Organisation:", err);
        res.status(500).json({ error: "Error fetching Organisation" });
      });
  };

  
  export const RequestController = async (req,res)=>{
    // Logic to fetch districts by state ID from the database
    const { FactoryId } = req.params;
    pool
      .request()
      .input("FactoryId", sql.Int, FactoryId)
      .query("SELECT EmployeeId,Name + '-' + BiometricCode as Employee FROM EmployeeMaster EMP WHERE FactoryId = @FactoryId") // Check if the column name is correct (EmployeeId)
      .then((result) => {
        res.json(result.recordset);
      })
      .catch((err) => {
        console.error("Error fetching Request:", err);
        res.status(500).json({ error: "Error fetching Request" });
      });
  };

  export const getLeaveController = async (req, res) => {
    try {
      const result = await pool.request().query("SELECT ReasonId, Reason FROM LeaveReasons");
      res.json(result.recordset);
    } catch (error) {
      console.error("Error fetching LeaveReasons:", error.message);
      res.status(500).json({ error: "Error fetching LeaveReasons" });
    }
  };
  