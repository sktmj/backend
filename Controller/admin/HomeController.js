
import sql from "mssql";
import pool from "../../config/db.js";



export const getCalander = async (req, res) => {
    try {
      // Logic to fetch all courses from the database
      const result = await pool.request().query("SELECT * FROM Calendar");
      res.json(result.recordset);
    } catch (error) {
      console.error("Error fetching Calender:", error.message);
      res.status(500).json({ error: "Error fetching Calender" });
    }
  };


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
  
 

  export const insertOutpassController = async (req, res) => {
    const { FromTime, ToTime, ReturnSts, OPType, Reason } = req.body;
  
    // Extract the EmployeeId from the Authorization header
    const EmployeeId = req.headers.authorization.split(" ")[1];
  
    // Check if EmployeeId is present
    if (!EmployeeId) {
      return res.status(404).json({ success: false, message: "EmployeeId not found in session" });
    }
  
    try {
      // Prepare the SQL request
      const request = pool.request();
      
      // Add parameters to the request
      request.input('Case', sql.NVarChar, 'Insert');
      request.input('EmployeeId', sql.Int, EmployeeId);
      request.input('FromTime', sql.DateTime, FromTime); // Ensure that FromTime is in the correct DateTime format
      request.input('ToTime', sql.DateTime, ToTime); // Ensure that ToTime is in the correct DateTime format
      request.input('ReturnSts', sql.Char, ReturnSts); // Using Char for single characters
      request.input('OPType', sql.Char, OPType); // Using Char for single characters
      request.input('Reason', sql.NVarChar, Reason);
      request.input('UserId', sql.Int, EmployeeId); // Assuming UserId is the same as EmployeeId
  
      // Execute the stored procedure
      const result = await request.execute('SP_OutPass');
      
      // Respond with success message
      res.json({ success: true, message: 'Outpass submitted successfully', result: result.recordset });
    } catch (err) {
      console.error('Error submitting Outpass:', err);
      res.status(500).json({ error: 'Error submitting Outpass' });
    }
  };