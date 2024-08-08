import {pool} from "../../config/db.js";
import sql from "mssql";

export const PermissionController = async (req, res) => {
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
      .query(`
        SELECT 
          BiometricCode as ECNo,
          Name as EmpName,
          FromDate as Dte,
          FromTime,
          ToTime,
          'Manual' as Type 
        FROM LeaveEntry LE
        INNER JOIN EmployeeMaster EMP ON EMP.EmployeeId = LE.EmployeeId
        INNER JOIN ShiftDetails SFT ON SFT.ShiftId = EMP.ShiftId
        WHERE 
          TrnMode = 'P'
          AND FromDate >= @FromDate 
          AND FromDate <= @ToDate 
          AND CONVERT(TIME, FromTime) >= DATEADD(Hour, 1, CONVERT(TIME, SFT.StartTime))
          AND CONVERT(TIME, ToTime) <= DATEADD(Hour, -1, CONVERT(TIME, SFT.EndTime))
          AND EMP.EmployeeId = @EmployeeId
        UNION ALL
        SELECT 
          BiometricCode as ECNo,
          Name as EmpName,
          AttendanceDate as Dte,
          Intime as FromTime,
          OutTime as ToTime,
          'Auto' as Type 
        FROM EmployeeAttendance ATT
        INNER JOIN EmployeeMaster EMP ON EMP.EmployeeId = ATT.EmployeeId
        INNER JOIN ShiftDetails SFT ON SFT.ShiftId = EMP.ShiftId
        WHERE 
          AttendanceDate >= @FromDate 
          AND AttendanceDate <= @ToDate 
          AND EMP.EmployeeId = @EmployeeId
          AND NoPermission > 0
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Error fetching data" });
  }
};



