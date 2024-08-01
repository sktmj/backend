import sql from "mssql";
import pool from "../../config/db.js";




export const musterController = async(req,res)=>{
    const { EmployeeId } = req.params;
    const { FromDate, ToDate } = req.query;
  
    // Log the received parameters to verify
    console.log('EmployeeId:', EmployeeId);
    console.log('FromDate:', FromDate);
    console.log('ToDate:', ToDate);
  
    // Ensure FromDate and ToDate are provided
    if (!FromDate || !ToDate) {
      return res.status(400).json({ error: "FromDate and ToDate are required" });
    }
  
    try {
      const result = await pool.request()
        .input("EmployeeId", sql.Int, EmployeeId)
        .input("FromDate", sql.Date, FromDate)
        .input("ToDate", sql.Date, ToDate)
        .query(`SELECT ATT.EmployeeId,AttendanceDate,SUBSTRING(CONVERT(VARCHAR,InTime,108),1,5) as InTime,
                    SUBSTRING(CONVERT(VARCHAR,OutTime,108),1,5) as OutTime,
                   CASE WHEN Present = 'Y' THEN 'P' WHEN Present = 'O' THEN 'O' WHEN HalfDayPresent = 'Y' THEN 'P/' WHEN Absent = 'Y' 
				   AND WeekOff = 'N' AND Holiday = 'N' AND EMP.dateofjoining <= AttendanceDate THEN 'A' WHEN WeekOff = 'Y' THEN 'W' WHEN Holiday = 'Y' 
				   THEN 'H' ELSE 'L' END as DayType,
                    CASE WHEN Present = 'Y' THEN 1 WHEN Present = 'O' THEN 1 WHEN HalfDayPresent = 'Y' THEN 0.5 ELSE 0 END as Days
                    FROM EmployeeAttendance ATT
                    INNER JOIN EmployeeMaster EMP ON EMP.EmployeeId = ATT.EmployeeId
                   WHERE AttendanceDate >= @FromDate 
                   AND AttendanceDate <=  @ToDate  
                    AND  EMP.EmployeeId = @EmployeeId`);
  
      res.json(result.recordset);
    } catch (err) {
      console.error("Error fetching data:", err);
      res.status(500).json({ error: "Error fetching data" });
    }
  };
