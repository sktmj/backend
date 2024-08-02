import sql from "mssql";
import { pool, daivelPool } from "../../config/db.js";

export const PunchController = async (req, res) => {
  const { EmployeeId } = req.params;
  const { FromDate, ToDate } = req.query; // Ensure you are getting FromDate and ToDate from query parameters

  // Log the received parameters to verify
  console.log("EmployeeId:", EmployeeId);
  console.log("FromDate:", FromDate);
  console.log("ToDate:", ToDate);

  try {
    // Step 1: Fetch the EmployeeId from SKTPayroll database
    const employeeResult = await pool
      .request()
      .input("EmployeeId", sql.Int, EmployeeId)
      .query(`
        SELECT EmployeeId
        FROM EmployeeMaster
        WHERE EmployeeId = @EmployeeId
      `);

    if (employeeResult.recordset.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const { EmployeeId: employeeIdFromPayroll } = employeeResult.recordset[0];

    // Step 2: Proceed with the query on the daivel database
    const DtpFrmDate = new Date(FromDate);
    const DtpToDate = new Date(ToDate);
    DtpToDate.setHours(23, 59, 59, 999);

    const month = DtpFrmDate.getMonth() + 1;
    const year = DtpFrmDate.getFullYear();
    const StrTableName = `DeviceLogs_${month}_${year}`;

    // Check if the table exists
    const tableCheckResult = await daivelPool
      .request()
      .input("TableName", sql.NVarChar, StrTableName)
      .query(`
        SELECT * 
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_NAME = @TableName
      `);

    if (tableCheckResult.recordset.length === 0) {
      return res.status(404).json({ error: `Table ${StrTableName} does not exist` });
    }

    const result = await daivelPool
      .request()
      .input("EmployeeId", sql.Int, employeeIdFromPayroll)
      .input("DtpFrmDate", sql.DateTime, DtpFrmDate)
      .input("DtpToDate", sql.DateTime, DtpToDate)
      .query(`
        SELECT 
          CONVERT(NVARCHAR, LogDate, 105) AS PunchDate,
          FORMAT(Dev.LogDate, 'HH:mm tt') AS PunchTime,
          D.DeviceFName 
        FROM ${StrTableName} Dev
        INNER JOIN Devices D ON D.DeviceId = Dev.DeviceId
        INNER JOIN Employees E ON E.EmployeeCode = Dev.UserId
        INNER JOIN SKTPayroll.dbo.EmployeeMaster EMP ON EMP.BiometricCode = E.EmployeeCode
        WHERE CONVERT(DATE, LogDate) >= @DtpFrmDate
          AND CONVERT(DATE, LogDate) <= @DtpToDate
          AND EMP.EmployeeId = @EmployeeId
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Error fetching data" });
  }
};


//     const { EmployeeId } = req.params;
//     const { FromDate, ToDate } = req.query;

//     if (!FromDate || !ToDate) {
//         return res.status(400).json({ error: 'FromDate and ToDate are required' });
//     }

//     try {
//         const DtpFrmDate = new Date(FromDate);
//         const DtpToDate = new Date(ToDate);
//         DtpToDate.setHours(23, 59, 59, 999);

//         // Fetch BiometricCode from EmployeeMaster
//         const biometricCodeQuery = `
//             SELECT EmployeeCode
//             FROM SKTPayroll..EmployeeMaster
//             WHERE EmployeeId = @EmployeeId
//         `;

//         const biometricCodeResult = await pool.request()
//             .input('EmployeeId', sql.Int, EmployeeId)
//             .query(biometricCodeQuery);

//         if (biometricCodeResult.recordset.length === 0) {
//             return res.status(404).json({ error: 'Employee not found' });
//         }

//         const biometricCode = biometricCodeResult.recordset[0].EmployeeCode;

//         // Prepare table names and SQL query
//         const month = DtpFrmDate.getMonth() + 1;
//         const year = DtpFrmDate.getFullYear();
//         const StrTableName = `DeviceLogs_${month}_${year}`;
//         let Sqlstr = `
//             SELECT DeviceFName as Device, FAC.FactoryName as Factory, EMP.EmployeeId, EMP.EmployeeCode as ECNo, EMP.Name as EmpName,
//                    CONVERT(DATE, LogDate) as Dte, LogDate as PunchTime
//             FROM ${StrTableName} Dev
//             JOIN daivel.dbo.Employees E ON E.UserId = Dev.UserId
//             JOIN SKTPayroll..EmployeeMaster EMP ON  E.EmployeeCode = EMP.BiometricCode
//             JOIN SKTPayroll..FactoryMaster FAC ON EMP.FactoryId = FAC.FactoryId
//             JOIN daivel.dbo.Devices D ON Dev.DeviceId = D.DeviceId
//             WHERE CONVERT(DATE, LogDate) >= @DtpFrmDate
//               AND CONVERT(DATE, LogDate) <= @DtpToDate
//               AND EMP.EmployeeId= @EmployeeId
//         `;

//         if (DtpFrmDate.getMonth() !== DtpToDate.getMonth() || DtpFrmDate.getFullYear() !== DtpToDate.getFullYear()) {
//             const nextMonth = DtpToDate.getMonth() + 1;
//             const nextYear = DtpToDate.getFullYear();
//             const nextTable = `DeviceLogs_${nextMonth}_${nextYear}`;

//             Sqlstr += `
//                 UNION ALL
//                 SELECT DeviceFName as Device, FAC.FactoryName as Factory, EMP.EmployeeId, EMP.EmployeeCode as ECNo, EMP.Name as EmpName,
//                        CONVERT(DATE, LogDate) as Dte, LogDate as PunchTime
//                 FROM ${nextTable} Dev
//                 JOIN daivel.dbo.Employees E ON E.UserId = Dev.UserId
//                 JOIN SKTPayroll..EmployeeMaster EMP ON  E.EmployeeCode = EMP.BiometricCode
//                 JOIN SKTPayroll..FactoryMaster FAC ON EMP.FactoryId = FAC.FactoryId
//                 JOIN daivel.dbo.Devices D ON Dev.DeviceId = D.DeviceId
//                 WHERE CONVERT(DATE, LogDate) >= @DtpFrmDate
//                   AND CONVERT(DATE, LogDate) <= @DtpToDate
//                    AND EMP.EmployeeId= @EmployeeId
//             `;
//         }

//         const result = await pool.request()
//             .input('DtpFrmDate', sql.DateTime, DtpFrmDate)
//             .input('DtpToDate', sql.DateTime, DtpToDate)
//             .input('BiometricCode', sql.NVarChar, biometricCode)
//             .query(Sqlstr);

//         res.json(result.recordset);
//     } catch (error) {
//         console.error('Error fetching punch data:', error.message);
//         res.status(500).json({ error: 'An error occurred while fetching punch data' });
//     }
// };
