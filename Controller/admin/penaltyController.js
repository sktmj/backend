import pool from "../../config/db.js";
import sql from "mssql";


export const DailyController = async (req, res) => {
    const { EmployeeId } = req.params;
    const { FromDate, ToDate } = req.query; // Ensure you are getting FromDate and ToDate from query parameters
  
    try {
      const result = await pool.request()
        .input("EmployeeId", sql.Int, EmployeeId)
        .input("FromDate", sql.Date, FromDate)
        .input("ToDate", sql.Date, ToDate)
        .query("SELECT FactoryName as Factory, EMP.Biometriccode as ECNo, EMP.Name as EmpName, InTime, OutTime, LateMins, AttendanceDate as AttDate, ATT.Penalty as Amount "
             + "FROM EmployeeAttendance ATT "
             + "INNER JOIN EmployeeMaster EMP ON ATT.EmployeeId = EMP.EmployeeId "
             + "INNER JOIN FactoryMaster FAC ON FAC.FactoryId = EMP.FactoryId "
             + "WHERE ATT.AttendanceDate >= @FromDate "
             + "AND ATT.AttendanceDate <= @ToDate "
             + "AND ATT.EmployeeId = @EmployeeId "
             + "AND LateMins > 0 "
             + "ORDER BY AttendanceDate, FactoryName, EMP.Name");
  
      res.json(result.recordset);
    } catch (err) {
      console.error("Error fetching data:", err);
      res.status(500).json({ error: "Error fetching data" });
    }
  };