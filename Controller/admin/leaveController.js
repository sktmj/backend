import sql from "mssql";
import {pool} from "../../config/db.js";


export const leavePhotoController = async (req, res) => {
  // Assuming you don't need to fetch from the database as per your requirement
  res.json({ success: true, message: 'File uploaded successfully' });
};


export const employeIdcontroller = async (req, res) => {
  // Logic to fetch districts by state ID from the database
  const { EmployeeId } = req.params;
  pool
    .request()
    .input("EmployeeId", sql.Int, EmployeeId)
    .query(
      "SELECT EmployeeId,Name + '-' + BiometricCode as Employee FROM EmployeeMaster  WHERE EmployeeId = @EmployeeId"
    ) // Check if the column name is correct (EmployeeId)
    .then((result) => {
      res.json(result.recordset);
    })
    .catch((err) => {
      console.error("Error fetching employeId:", err);
      res.status(500).json({ error: "Error fetching employeId" });
    });
};

export const OrganisationController = async (req, res) => {
  // Logic to fetch districts by state ID from the database
  const { EmployeeId } = req.params;
  pool
    .request()
    .input("EmployeeId", sql.Int, EmployeeId)
    .query(
      "SELECT FAC.FactoryName as Factory,FAC.FactoryId FROM EmployeeMaster EMP INNER JOIN FactoryMaster FAC ON  EMP.FactoryId=FAC.FactoryId  WHERE EmployeeId = @EmployeeId"
    ) // Check if the column name is correct (EmployeeId)
    .then((result) => {
      res.json(result.recordset);
    })
    .catch((err) => {
      console.error("Error fetching Organisation:", err);
      res.status(500).json({ error: "Error fetching Organisation" });
    });
};

export const RequestController = async (req, res) => {
  // Logic to fetch districts by state ID from the database
  const { FactoryId } = req.params;
  pool
    .request()
    .input("FactoryId", sql.Int, FactoryId)
    .query(
      "SELECT EmployeeId,Name + '-' + BiometricCode as Employee FROM EmployeeMaster EMP WHERE FactoryId = @FactoryId"
    ) // Check if the column name is correct (EmployeeId)
    .then((result) => {
      res.json(result.recordset);
    })
    .catch((err) => {
      console.error("Error fetching Request:", err);
      res.status(500).json({ error: "Error fetching Request" });
    });
};

export const getLeaveController = async (req, res) => {
  try {
    const result = await pool
      .request()
      .query("SELECT ReasonId, Reason FROM LeaveReasons");
    res.json(result.recordset);
  } catch (error) {
    console.error("Error fetching LeaveReasons:", error.message);
    res.status(500).json({ error: "Error fetching LeaveReasons" });
  }
};

export const insertLeaveController = async (req, res) => {
    console.log(req.body,"lalalalal")
  const {
    TrnDate,
    TrnMode,
    ReturnSts,
    ModeType,
    HandOverTo,
    RequestTo,
    Priority,
    LeaveType,
    FromDate,
    ToDate,
    FromTime,
    ToTime,
    Reason,
    Remarks,
    UserId,
    ApproveStatus,
  } = req.body;
  const EmployeeId = req.headers.authorization?.split(" ")[1];
  
  if (!EmployeeId) {
    return res
      .status(404)
      .json({ success: false, message: "EmployeeId not found in session" });
  }

  try {
    const request = pool
      .request()
      .input("Case", sql.NVarChar, "Insert")
      .input("TrnDate", sql.Date, TrnDate)
      .input("TrnMode", sql.Char, TrnMode)
      .input("ReturnSts", sql.Char, ReturnSts)
      .input("ModeType", sql.Char, ModeType)
      .input("EmployeeId", sql.Int, EmployeeId)
      .input("HandOverTo", sql.Int, HandOverTo)
      .input("RequestTo", sql.Int, RequestTo)
      .input("Priority", sql.Char, Priority)
      .input("LeaveType", sql.Char, LeaveType)
      .input("FromDate", sql.DateTime, FromDate)
      .input("ToDate", sql.DateTime, ToDate)
      .input("FromTime", sql.DateTime,FromTime)
      .input("ToTime", sql.DateTime,ToTime)
      .input("Reason", sql.Int, Reason)
      .input("Remarks", sql.VarChar, Remarks)
      .input("UserId", sql.Int, UserId)
      .input("ApproveStatus", sql.Char, ApproveStatus);

    const result = await request.execute("SP_LeaveEntry");

    res.json({
      success: true,
      message: "Leave submitted successfully",
      result: result.recordset,
    });
  } catch (err) {
    console.error("Error submitting leave:", err);
    res
      .status(500)
      .json({ error: "Error submitting leave Entry", details: err.message });
  }
};





export const getLeaveReportController = async(req,res)=>{
    const { EmployeeId } = req.params;
    const { FromDate, ToDate } = req.query;
  
    // Log the received parameters to verify
    console.log('EmployeeId:', EmployeeId);
    console.log('FromDate:', FromDate);
    console.log('ToDate:', ToDate);
  
    // Ensure FromDate and ToDate are provided
    if (!FromDate || !ToDate) {
      return res.status(400).json({ error: "FromDate and ToDate are required" });
    }
  
    try {
      const request = pool
      .request()
      .input("Case", sql.NVarChar, "List")
        .input("EmployeeId", sql.Int, EmployeeId)
        .input("FromDate", sql.Date, FromDate)
        .input("ToDate", sql.Date, ToDate)
        const result = await request.execute("SP_LeaveEntry");

    res.json({
      success: true,
      message: "GetLeave submitted successfully",
      result: result.recordset,
    });
  } catch (err) {
    console.error("Error submitting Getleave:", err);
    res
      .status(500)
      .json({ error: "Error submitting Getleave", details: err.message });
  }
};
