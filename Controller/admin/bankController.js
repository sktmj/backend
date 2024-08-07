import { pool } from "../../config/db.js";
import sql from "mssql";

export const BankController = async (req, res) => {
  const { EmployeeId } = req.params; // Fetch EmployeeId from route params
  // Fetch FromDate and ToDate from query params

  // Log the received parameters to verify
  console.log("EmployeeId:", EmployeeId);

  // Ensure FromDate and ToDate are provided

  try {
    const result = await pool.request()
    .input("EmployeeId", sql.Int, EmployeeId)
      .query(`select AadharNo,AccountNo,IFSCCode,BNK.BankName,Branchname from EmployeeMaster EMP
  INNER JOIN BankMaster BNK ON BNK.BankId=EMP.BankId 
  where EMP.EmployeeId=@EmployeeId
        `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Error fetching data" });
  }
};
