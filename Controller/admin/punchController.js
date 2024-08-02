import sql from "mssql";
import { daivelPool, pool } from "../../config/db.js";

export const PunchController = async (req, res) => {
    const { UserId } = req.params;
    const { FromDate, ToDate } = req.query;

    if (!FromDate || !ToDate) {
        return res.status(400).json({ error: "FromDate and ToDate are required" });
    }

    try {
        const DtpFrmDate = new Date(FromDate);
        const DtpToDate = new Date(ToDate);
        DtpToDate.setHours(23, 59, 59, 999);

        const month = DtpFrmDate.getMonth() + 1;
        const year = DtpFrmDate.getFullYear();
        const StrTableName = `DeviceLogs_${month}_${year}`;

        // Ensure the table exists
        const checkTableQuery = `
            SELECT *
            FROM INFORMATION_SCHEMA.TABLES
            WHERE TABLE_NAME = @TableName
        `;

        const tableCheck = await pool.request()
            .input('TableName', sql.NVarChar, StrTableName)
            .query(checkTableQuery);
      console.log('Table Name:', StrTableName);
        if (tableCheck.recordset.length === 0) {
            return res.status(404).json({ error: `Table ${StrTableName} does not exist` });
        }

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
              AND Dev.UserId = @UserId
        `;

        if (DtpFrmDate.getMonth() !== DtpToDate.getMonth() || DtpFrmDate.getFullYear() !== DtpToDate.getFullYear()) {
            const nextMonth = DtpToDate.getMonth() + 1;
            const nextYear = DtpToDate.getFullYear();
            const StrNextMonthTableName = `DeviceLogs_${nextMonth}_${nextYear}`;

            // Check if the next month table exists
            const nextTableCheck = await pool.request()
                .input('TableName', sql.NVarChar, StrNextMonthTableName)
                .query(checkTableQuery);

            if (nextTableCheck.recordset.length === 0) {
                return res.status(404).json({ error: `Table ${StrNextMonthTableName} does not exist` });
            }

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
                  AND Dev.UserId = @UserId
            `;
        }

        Sqlstr += " ORDER BY EMP.EmployeeId, Dte, PunchTime";

        // Fetch data from SKTPayroll database
        const resultSKT = await pool.request()
            .input("UserId", sql.Int, UserId)
            .input("DtpFrmDate", sql.Date, DtpFrmDate)
            .input("DtpToDate", sql.Date, DtpToDate)
            .query(Sqlstr);

        // Fetch data from daivel database
        const resultDaivel = await daivelPool.request()
            .input("UserId", sql.Int, UserId)
            .input("DtpFrmDate", sql.Date, DtpFrmDate)
            .input("DtpToDate", sql.Date, DtpToDate)
            .query(Sqlstr);

        // Combine results from both databases
        const combinedResults = [...resultSKT.recordset, ...resultDaivel.recordset];

        res.json(combinedResults);
    } catch (err) {
        console.error("Error fetching punch report:", err.message);
        res.status(500).json({ error: "Error fetching punch report" });
    }
};
