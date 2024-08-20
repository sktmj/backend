import sql from 'mssql';
import { pool } from '../../config/db.js';

export const HomeController  = async (req, res) => {
  // Extract parameters and query data
  const { EmployeeId } = req.params;
  const { StDate, EndDate } = req.query;
  
  console.log('EmployeeId:', EmployeeId);
  console.log('StDate:', StDate);
  console.log('EndDate:', EndDate);

  // Initialize conditional SQL clause
  let cond = '';

  // Check if EmployeeId is provided and is valid
  if (EmployeeId) {
    cond = ` AND EMP.EmployeeId = @EmployeeId`;
  }

  try {
    // Execute SQL query
    const result = await pool.request()
      .input('EmployeeId', sql.Int, EmployeeId)
      .input('StDate', sql.Date, new Date(StDate))
      .input('EndDate', sql.Date, new Date(EndDate))
      .query(`
        SELECT 
          FAC.FactoryName as Factory,
          BiometricCode as ECNo,
          Name,
          ISNULL(ATT.Present, 0.0) + (ISNULL(ATT.HalfDay, 0.0) * 0.5) as Present,
          ISNULL(ATT.OnDuty, 0.0) as OnDuty,
          ISNULL(ATT.Leave, 0.0) as Leave,
          ISNULL(ATT.Absent, 0.0) as Absent,
          ISNULL(ATT.WeekOff, 0.0) as WeekOff,
          ISNULL(ATT.Holiday, 0.0) as Holiday
        FROM 
          EmployeeMaster EMP
        INNER JOIN 
          FactoryMaster FAC ON FAC.FactoryId = EMP.FactoryId
        LEFT JOIN 
          (SELECT 
            EmployeeId,
            SUM(CASE WHEN Present = 'Y' THEN 1.0 ELSE 0.0 END) as Present,
            SUM(CASE WHEN Present = 'O' THEN 1.0 ELSE 0.0 END) as OnDuty,
            SUM(CASE WHEN HalfDayPresent = 'Y' THEN 1.0 ELSE 0.0 END) as HalfDay,
            SUM(CASE WHEN Leave = 'Y' THEN 1.0 ELSE 0.0 END) as Leave,
            SUM(CASE WHEN Absent = 'Y' AND WeekOff = 'N' AND Holiday = 'N' THEN 1.0 ELSE 0.0 END) as Absent,
            SUM(CASE WHEN Present = 'N' AND Leave = 'N' AND Absent = 'N' AND HalfDayPresent = 'N' AND WeekOff = 'Y' AND Holiday = 'N' THEN 1.0 ELSE 0.0 END) as WeekOff,
            SUM(CASE WHEN Present = 'N' AND Leave = 'N' AND Absent = 'N' AND HalfDayPresent = 'N' AND WeekOff = 'N' AND Holiday = 'Y' THEN 1.0 ELSE 0.0 END) as Holiday
          FROM 
            EmployeeAttendance
          WHERE 
            AttendanceDate >= @StDate
            AND AttendanceDate <= @EndDate
          GROUP BY 
            EmployeeId
          ) ATT ON ATT.EmployeeId = EMP.EmployeeId
        WHERE 
          EMP.IsValid = 'Y'
          ${cond}
        ORDER BY 
          EMP.FactoryId, EMP.EmployeeId;
      `);

    // Map results to desired format
    const itemList = result.recordset.map(record => ({
      Present: record.Present,
      Absent: record.Absent,
      Leave: record.Leave,
      OnDuty: record.OnDuty,
      WeekOff: record.WeekOff,
      Holiday: record.Holiday,
    }));

    // Send response
    res.json(itemList);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Error fetching data" });
  }
};
