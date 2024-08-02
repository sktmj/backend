import sql from 'mssql';
import { daivelPool, pool } from '../../config/db.js';

export const PunchController = async (req, res) => {
    const { EmployeeId } = req.params;
    const { FromDate, ToDate } = req.query;

    if (!FromDate || !ToDate) {
        return res.status(400).json({ error: 'FromDate and ToDate are required' });
    }

    try {
        const DtpFrmDate = new Date(FromDate);
        const DtpToDate = new Date(ToDate);
        DtpToDate.setHours(23, 59, 59, 999);

        const month = DtpFrmDate.getMonth() + 1;
        const year = DtpFrmDate.getFullYear();
        const StrTableName = `DeviceLogs_${month}_${year}`;

        // Check if the table exists
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
            const nextTable = `DeviceLogs_${nextMonth}_${nextYear}`;

            Sqlstr += `
                UNION ALL
                SELECT DeviceFName as Device, FAC.FactoryName as Factory, EMP.EmployeeId, EmployeeCode as ECNo, EMP.Name as EmpName, 
                       CONVERT(DATE, LogDate) as Dte, LogDate as PunchTime
                FROM ${nextTable} Dev
                JOIN daivel.dbo.Employees E ON E.UserId = Dev.UserId
                JOIN SKTPayroll..EmployeeMaster EMP ON EmployeeCode = EMP.BiometricCode
                JOIN SKTPayroll..FactoryMaster FAC ON EMP.FactoryId = FAC.FactoryId
                JOIN daivel.dbo.Devices D ON Dev.DeviceId = D.DeviceId
                WHERE CONVERT(DATE, LogDate) >= @DtpFrmDate
                  AND CONVERT(DATE, LogDate) <= @DtpToDate
                  AND Dev.UserId = @UserId
            `;
        }

        const result = await pool.request()
            .input('DtpFrmDate', sql.DateTime, DtpFrmDate)
            .input('DtpToDate', sql.DateTime, DtpToDate)
            .input('UserId', sql.Int, EmployeeId)
            .query(Sqlstr);

        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching punch data:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching punch data' });
    }
};
