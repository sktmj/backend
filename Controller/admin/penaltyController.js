import { pool } from "../../config/db.js";
import sql from "mssql";

export const DailyController = async (req, res) => {
  const { EmployeeId } = req.params;
  const { FromDate, ToDate } = req.query; // Ensure you are getting FromDate and ToDate from query parameters

  // Log the received parameters to verify
  console.log("EmployeeId:", EmployeeId);
  console.log("FromDate:", FromDate);
  console.log("ToDate:", ToDate);

  try {
    const result = await pool
      .request()
      .input("EmployeeId", sql.Int, EmployeeId)
      .input("FromDate", sql.Date, FromDate)
      .input("ToDate", sql.Date, ToDate).query(`SELECT 
                        FactoryName as Factory, 
                        EMP.Biometriccode as ECNo, 
                        EMP.Name as EmpName, 
                        InTime, 
                        OutTime, 
                        LateMins, 
                        AttendanceDate as AttDate, 
                        ATT.Penalty as Amount
                    FROM EmployeeAttendance ATT
                    INNER JOIN EmployeeMaster EMP ON ATT.EmployeeId = EMP.EmployeeId
                    INNER JOIN FactoryMaster FAC ON FAC.FactoryId = EMP.FactoryId
                    WHERE ATT.AttendanceDate >= @FromDate
                    AND ATT.AttendanceDate <= @ToDate
                    AND ATT.EmployeeId = @EmployeeId
                    AND LateMins > 0
                    ORDER BY AttendanceDate, FactoryName, EMP.Name`);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Error fetching data" });
  }
};

export const SummeryController = async (req, res) => {
  const { EmployeeId } = req.params;
  const { FromDate, ToDate } = req.query;

  // Log the received parameters to verify
  console.log("EmployeeId:", EmployeeId);
  console.log("FromDate:", FromDate);
  console.log("ToDate:", ToDate);

  // Ensure FromDate and ToDate are provided
  if (!FromDate || !ToDate) {
    return res.status(400).json({ error: "FromDate and ToDate are required" });
  }

  try {
    const result = await pool
      .request()
      .input("EmployeeId", sql.Int, EmployeeId)
      .input("FromDate", sql.Date, FromDate)
      .input("ToDate", sql.Date, ToDate).query(`SELECT 
                  FactoryName as Factory,
                  EMP.Biometriccode as ECNo,
                  EMP.Name as EmpName,
                  SUM(LateMins) as LateMins,
                  GETDATE() as AttDate,
                  SUM(ATT.Penalty) as Amount
                FROM EmployeeAttendance ATT
                INNER JOIN EmployeeMaster EMP ON ATT.EmployeeId = EMP.EmployeeId
                INNER JOIN FactoryMaster FAC ON FAC.FactoryId = EMP.FactoryId
                WHERE ATT.AttendanceDate >= @FromDate 
                  AND ATT.AttendanceDate <= @ToDate 
                    AND ATT.EmployeeId = @EmployeeId
                  AND LateMins > 0
                GROUP BY FactoryName, EMP.Biometriccode, EMP.Name
                ORDER BY FactoryName, EMP.Name`);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Error fetching data" });
  }
};

export const OthersController = async (req, res) => {
  const { EmployeeId } = req.params;
  const { FromDate, ToDate } = req.query;

  // Log the received parameters to verify
  console.log("EmployeeId:", EmployeeId);
  console.log("FromDate:", FromDate);
  console.log("ToDate:", ToDate);

  // Ensure FromDate and ToDate are provided
  if (!FromDate || !ToDate) {
    return res.status(400).json({ error: "FromDate and ToDate are required" });
  }

  try {
    const result = await pool
      .request()
      .input("EmployeeId", sql.Int, EmployeeId)
      .input("FromDate", sql.Date, FromDate)
      .input("ToDate", sql.Date, ToDate)
      .query(`SELECT FactoryName as Factory,EMP.Biometriccode as ECNo, EMP.Name as EmpName,
                        SUM(TotalAmt) as Penalty,Remarks,GETDATE() as AttDate
                        FROM EmployeePenalty PEN
                       INNER JOIN EmployeeMaster EMP ON PEN.EmployeeId = EMP.EmployeeId
                        INNER JOIN FactoryMaster FAC ON FAC.FactoryId = EMP.FactoryId
                        WHERE PEN.PenaltyDate >= @FromDate 
                        AND PEN.PenaltyDate <= @ToDate 
                        AND PEN.EmployeeId = @EmployeeId
                        AND PEN.PenaltyType = 'O'
                        GROUP BY FactoryName,EMP.Biometriccode,EMP.Name,Remarks
                        ORDER BY FactoryName,EMP.Name`);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Error fetching data" });
  }
};
