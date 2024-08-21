import sql from 'mssql';
import { pool } from '../../config/db.js';

export const HomeController = async (req, res) => {
  const { EmployeeId } = req.params;
  const { StDate, EndDate, CalendarId } = req.query;

  console.log('EmployeeId:', EmployeeId);
  console.log('StDate:', StDate);
  console.log('EndDate:', EndDate);

  let cond = '';
  if (EmployeeId) {
    cond = ' AND EMP.EmployeeId = @EmployeeId';
  }

  try {
    // Fetch attendance data
    const attendanceResult = await pool.request()
      .input('EmployeeId', sql.Int, EmployeeId)
      .input('StDate', sql.Date, new Date(StDate))
      .input('EndDate', sql.Date, new Date(EndDate))
      .query(`
        SELECT 
          CONVERT(nvarchar, AttendanceDate, 103) as AttDate,
          SUBSTRING(CONVERT(VARCHAR, InTime, 108), 1, 5) as InTime,
          SUBSTRING(CONVERT(VARCHAR, OutTime, 108), 1, 5) as OutTime,
          CASE 
            WHEN Present = 'Y' THEN 'P'
            WHEN Present = 'O' THEN 'O'
            WHEN HalfDayPresent = 'Y' THEN 'P/'
            WHEN Absent = 'Y' AND WeekOff = 'N' AND Holiday = 'N' THEN 'A'
            WHEN WeekOff = 'Y' THEN 'W'
            WHEN Holiday = 'Y' THEN 'H'
            ELSE 'L'
          END as DayType
        FROM EmployeeAttendance EMP
        WHERE AttendanceDate >= @StDate
          AND AttendanceDate <= @EndDate
          ${cond}
        ORDER BY AttendanceDate;
      `);

    // Fetch calendar data
    const calendarResult = await pool.request()
      .input('CalendarId', sql.Int, CalendarId)
      .query(`
        SELECT 
          CONVERT(varchar, CalendarStart, 103) as CalendarStart,
          CONVERT(varchar, CalendarEnd, 103) as CalendarEnd,
          WorkingDays,
          CalendarName
        FROM Calendar
        WHERE CalendarId = @CalendarId;
      `);

    // Send response
    res.json({
      attendanceData: attendanceResult.recordset,
      calendarData: calendarResult.recordset[0], // Assuming CalendarId returns a single record
    });
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Error fetching data" });
  }
};
