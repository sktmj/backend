import sql from "mssql";
import { pool } from "../../config/db.js";

export const HomeController = async (req, res) => {
  const { EmployeeId } = req.params;
  const { StDate, EndDate } = req.query;

  console.log("EmployeeId:", EmployeeId);
  console.log("StDate:", StDate);
  console.log("EndDate:", EndDate);

  let cond = "";

  if (EmployeeId) {
    cond = ` AND EMP.EmployeeId = @EmployeeId`;
  }

  try {
    const result = await pool
      .request()
      .input("EmployeeId", sql.Int, EmployeeId)
      .input("StDate", sql.Date, new Date(StDate))
      .input("EndDate", sql.Date, new Date(EndDate))
      .query(`
        SELECT 
          FAC.FactoryName as Factory,
          EMP.BiometricCode as ECNo,
          EMP.Name,
          ISNULL(SUM(CASE WHEN ATT.Present = 'Y' THEN 1.0 ELSE 0.0 END), 0.0) +
          ISNULL(SUM(CASE WHEN ATT.HalfDayPresent = 'Y' THEN 0.5 ELSE 0.0 END), 0.0) as Present,
          ISNULL(SUM(CASE WHEN ATT.Present = 'O' THEN 1.0 ELSE 0.0 END), 0.0) as OnDuty,
          ISNULL(SUM(CASE WHEN ATT.Leave = 'Y' THEN 1.0 ELSE 0.0 END), 0.0) as Leave,
          ISNULL(SUM(CASE WHEN ATT.Absent = 'Y' AND ATT.WeekOff = 'N' AND ATT.Holiday = 'N' THEN 1.0 ELSE 0.0 END), 0.0) as Absent,
          ISNULL(SUM(CASE WHEN ATT.WeekOff = 'Y' THEN 1.0 ELSE 0.0 END), 0.0) as WeekOff,
          ISNULL(SUM(CASE WHEN ATT.Holiday = 'Y' THEN 1.0 ELSE 0.0 END), 0.0) as Holiday,
          CONVERT(nvarchar, ATT.AttendanceDate, 103) as AttDate,
          SUBSTRING(CONVERT(nvarchar, ATT.InTime, 108), 1, 5) as InTime,
          SUBSTRING(CONVERT(nvarchar, ATT.OutTime, 108), 1, 5) as OutTime,
          CASE 
            WHEN ATT.Present = 'Y' THEN 'P'
            WHEN ATT.Present = 'O' THEN 'O'
            WHEN ATT.HalfDayPresent = 'Y' THEN 'P/'
            WHEN ATT.Absent = 'Y' AND ATT.WeekOff = 'N' AND ATT.Holiday = 'N' THEN 'A'
            WHEN ATT.WeekOff = 'Y' THEN 'W'
            WHEN ATT.Holiday = 'Y' THEN 'H'
            ELSE 'L'
          END as DayType
        FROM 
          EmployeeMaster EMP
        INNER JOIN 
          FactoryMaster FAC ON FAC.FactoryId = EMP.FactoryId
        LEFT JOIN 
          (SELECT 
            EmployeeId,
            Present,
            HalfDayPresent,
            Leave,
            Absent,
            WeekOff,
            Holiday,
            AttendanceDate,
            InTime,
            OutTime
           FROM 
            EmployeeAttendance
           WHERE 
            AttendanceDate >= @StDate
            AND AttendanceDate <= @EndDate
          ) ATT ON ATT.EmployeeId = EMP.EmployeeId
        WHERE 
          EMP.IsValid = 'Y' 
          ${cond}
        GROUP BY 
          FAC.FactoryName,
          EMP.BiometricCode,
          EMP.Name,
          ATT.AttendanceDate,
          ATT.InTime,
          ATT.OutTime,
          ATT.Present,
          ATT.HalfDayPresent,
          ATT.Absent,
          ATT.WeekOff,
          ATT.Holiday
      `);

    const itemList = result.recordset.map(record => ({
      Present: record.Present,
      Absent: record.Absent,
      Leave: record.Leave,
      OnDuty: record.OnDuty,
      WeekOff: record.WeekOff,
      Holiday: record.Holiday,
      AttDate: record.AttDate,
      InTime: record.InTime,
      OutTime: record.OutTime,
    }));

    res.json(itemList);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Error fetching data" });
  }
};
