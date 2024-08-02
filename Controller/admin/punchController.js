
import sql from "mssql";
import { daivelPool, pool } from "../../config/db.js";

export const PunchController = async (req, res) => {
  const { FromDate, ToDate, FactoryId, EmployeeId } = req.query;

  // Ensure FromDate and ToDate are provided
  if (!FromDate || !ToDate) {
    return res.status(400).json({ error: "FromDate and ToDate are required" });
  }

  try {
    const DtpFrmDate = new Date(FromDate);
    const DtpToDate = new Date(ToDate);
    DtpToDate.setHours(23); // Add 23 hours to DtpToDate

    let Cond = "";

    if (FactoryId > 0) {
      Cond += ` AND EMP.FactoryId = ${FactoryId}`;
    }

    if (EmployeeId > 0) {
      Cond += ` AND EMP.EmployeeId = ${EmployeeId}`;
    }

    const StrTableName = `DeviceLogs_${DtpFrmDate.getMonth() + 1}_${DtpFrmDate.getFullYear()}`;
    let Sqlstr = `
      SELECT DeviceFName as Device, FAC.FactoryName as Factory, EMP.EmployeeId, EmployeeCode as ECNo, EMP.Name as EmpName, 
             CONVERT(DATE, LogDate) as Dte, LogDate as PunchTime
      FROM ${StrTableName} Dev
      JOIN daivel.dbo.Employees E ON E.UserId = Dev.UserId
      JOIN SKTPayroll..EmployeeMaster EMP ON EmployeeCode = EMP.BiometricCode
      JOIN SKTPayroll..FactoryMaster FAC ON EMP.FactoryId = FAC.FactoryId
      JOIN daivel.dbo.Devices D ON Dev.DeviceId = D.DeviceId
      WHERE CONVERT(DATE, LogDate) >= @DtpFrmDate
        AND CONVERT(DATE, LogDate) <= @DtpToDate
        ${Cond}`;

    if (DtpFrmDate.getMonth() !== DtpToDate.getMonth()) {
      const StrNextMonthTableName = `DeviceLogs_${DtpToDate.getMonth() + 1}_${DtpToDate.getFullYear()}`;
      Sqlstr += `
        UNION
        SELECT DeviceFName as Device, FAC.FactoryName as Factory, EMP.EmployeeId, EmployeeCode as ECNo, EMP.Name as EmpName, 
               CONVERT(DATE, LogDate) as Dte, LogDate as PunchTime
        FROM ${StrNextMonthTableName} Dev
        JOIN daivel.dbo.Employees E ON E.UserId = Dev.UserId
        JOIN SKTPayroll..EmployeeMaster EMP ON EmployeeCode = EMP.BiometricCode
        JOIN SKTPayroll..FactoryMaster FAC ON EMP.FactoryId = FAC.FactoryId
        JOIN daivel.dbo.Devices D ON Dev.DeviceId = D.DeviceId
        WHERE CONVERT(DATE, LogDate) >= @DtpFrmDate
          AND CONVERT(DATE, LogDate) <= @DtpToDate
          ${Cond}`;
    }

    Sqlstr += " ORDER BY EMP.EmployeeId, Dte, PunchTime";

    const resultSKT = await pool.request()
      .input("DtpFrmDate", sql.Date, DtpFrmDate)
      .input("DtpToDate", sql.Date, DtpToDate)
      .query(Sqlstr);

    const resultDaivel = await daivelPool.request()
      .input("DtpFrmDate", sql.Date, DtpFrmDate)
      .input("DtpToDate", sql.Date, DtpToDate)
      .query(Sqlstr);

    const combinedResults = [...resultSKT.recordset, ...resultDaivel.recordset];

    res.json(combinedResults);
  } catch (err) {
    console.error("Error fetching punch report:", err);
    res.status(500).json({ error: "Error fetching punch report" });
  }
};
