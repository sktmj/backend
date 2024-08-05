import { pool } from "../../config/db.js";
import sql from "mssql";

export const PayslipController = async (req, res) => {
  const { EmployeeId } = req.params; // Fetch EmployeeId from route params
  const { FromDate, ToDate } = req.query; // Fetch FromDate and ToDate from query params

  // Log the received parameters to verify
  console.log("EmployeeId:", EmployeeId);
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
          EM.BioMetricCode,
          EM.Name,
          DM.DesignationName,
          EM.DateofJoining,
          PS.MonthDays as TotDays,
          ISNULL(ATT.Leave, 0) as Leave,
          (PS.ManDays + PS.OTDays) as Present,
          PS.FixedSalary,
          PS.NetAmountPaid as NetSalary,
          ISNULL(EM.PFNo, '') as PFNo,
          ISNULL(EM.ESINo, '') as ESINo,
          BNK.BankName,
          EM.AccountNo,
          EM.IFSCCode,
          PS.MonthDays,
          PS.ManDays,
          ((PS.BasicPay / PS.MonthDays) * PS.ManDays) as BasicPay,
          ((PS.HRA / PS.MonthDays) * PS.ManDays) as HRA,
          ((PS.DA / PS.MonthDays) * PS.ManDays) as DA,
          PS.OTPrice,
          PS.Incentive,
          ISNULL(PS.ESI, 0) as ESI,
          ISNULL(PS.EPF, 0) as EPF,
          PS.Advance,
          PS.TDS,
          PS.LWF,
          ISNULL(PS.SecDepostit, 0) as SecDeposit,
          ISNULL(PS.Penalty, 0) as Penalty,
          ISNULL(PS.Wastage, 0) as Wastage,
          ISNULL(PS.TDS, 0) as TDS,
          PS.Lossofpay
        FROM 
          payslips PS
        INNER JOIN 
          EmployeeMaster EM ON EM.EmployeeId = PS.EmployeeId
        LEFT JOIN 
          DesignationMaster DM ON DM.DesignationId = EM.DesignationId
        LEFT JOIN 
          BankMaster BNK ON BNK.BankId = EM.BankId
        LEFT JOIN 
          (SELECT 
            EmployeeId,
            SUM(CASE WHEN Leave = 'Y' THEN 1 ELSE 0 END) as Leave
           FROM 
            EmployeeAttendance
           WHERE 
            Convert(Date, AttendanceDate) >= @FromDate
            AND Convert(Date, AttendanceDate) <= @ToDate
           GROUP BY 
            EmployeeId
          ) ATT ON ATT.EmployeeId = EM.EmployeeId
        WHERE 
          PS.Mandays > 0
          AND Convert(Date, PS.PeriodFrom) = @FromDate
          AND Convert(Date, PS.PeriodTo) = @ToDate
          AND PS.NetAmountPaid > 0
          AND EM.EmployeeId = @EmployeeId
        ORDER BY 
          EM.FactoryId, EM.EmployeeId
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Error fetching data" });
  }
};
