import sql from "mssql";
import { pool, daivelPool } from "../../config/db.js";

export const PunchController = async (req, res) => {
  const { EmployeeId } = req.params;
  const { FromDate, ToDate } = req.query;

  // Log the received parameters to verify
  console.log("EmployeeId from params:", EmployeeId);
  console.log("FromDate:", FromDate);
  console.log("ToDate:", ToDate);

  // Validate and parse date parameters
  let DtpFrmDate, DtpToDate;
  try {
    DtpFrmDate = new Date(FromDate);
    DtpToDate = new Date(ToDate);
    if (isNaN(DtpFrmDate) || isNaN(DtpToDate)) {
      return res.status(400).json({ error: "Invalid date format" });
    }
    DtpToDate.setHours(23, 59, 59, 999);
  } catch (error) {
    return res.status(400).json({ error: "Invalid date parameters" });
  }

  try {
    // Fetch the EmployeeId from SKTPayroll database
    const employeeResult = await pool
      .request()
      .input("EmployeeId", sql.Int, EmployeeId).query(`
        SELECT EmployeeId
        FROM EmployeeMaster
        WHERE EmployeeId = @EmployeeId
      `);

    if (employeeResult.recordset.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const { EmployeeId: employeeIdFromPayroll } = employeeResult.recordset[0];

    // Generate table names
    const month = DtpFrmDate.getMonth() + 1;
    const year = DtpFrmDate.getFullYear();
    const StrTableName = `DeviceLogs_${month}_${year}`;

    const Tomonth = DtpToDate.getMonth() + 1;
    const Toyear = DtpToDate.getFullYear();
    const NxtStrTableName = `DeviceLogs_${Tomonth}_${Toyear}`;

    // Fetch punch data from both tables
    const result = await daivelPool
      .request()
      .input("EmployeeId", sql.Int, employeeIdFromPayroll)
      .input("DtpFrmDate", sql.DateTime, DtpFrmDate)
      .input("DtpToDate", sql.DateTime, DtpToDate).query(`
        SELECT 
          CONVERT(NVARCHAR, LogDate, 105) AS LogDate,
          FORMAT(Dev.LogDate, 'HH:mm tt') AS PunchTime,
          D.DeviceFName,
          Dev.DeviceLogId
        FROM ${StrTableName} Dev
        INNER JOIN Devices D ON D.DeviceId = Dev.DeviceId
        INNER JOIN Employees E ON E.EmployeeCode = Dev.UserId
        INNER JOIN SKTPayroll.dbo.EmployeeMaster EMP ON EMP.BiometricCode = E.EmployeeCode
        WHERE CONVERT(DATE, LogDate) >= @DtpFrmDate
          AND CONVERT(DATE, LogDate) <= @DtpToDate
          AND EMP.EmployeeId = @EmployeeId
        UNION 
        SELECT 
          CONVERT(NVARCHAR, LogDate, 105) AS LogDate,
          FORMAT(Dev.LogDate, 'HH:mm tt') AS PunchTime,
          D.DeviceFName,
          Dev.DeviceLogId
        FROM ${NxtStrTableName} Dev
        INNER JOIN Devices D ON D.DeviceId = Dev.DeviceId
        INNER JOIN Employees E ON E.EmployeeCode = Dev.UserId
        INNER JOIN SKTPayroll.dbo.EmployeeMaster EMP ON EMP.BiometricCode = E.EmployeeCode
        WHERE CONVERT(DATE, LogDate) >= @DtpFrmDate
          AND CONVERT(DATE, LogDate) <= @DtpToDate
          AND EMP.EmployeeId = @EmployeeId
        ORDER BY LogDate desc
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Error fetching data" });
  }
};
