import jwt from "jsonwebtoken";
import pool from "../../config/db.js";
import sql from "mssql";
const JWT_KEY = "your_secret_key_here"; // Make sure to use a secure key

// Function to generate JWT token
const generateJWT = (UserName, EmployeeId, UserId, FactoryId) => {
  const payload = { UserName, EmployeeId, UserId, FactoryId };
  return jwt.sign(payload, JWT_KEY, { expiresIn: "1h" }); // Token expires in 1 hour
};

export const Adminlogin = async (req, res) => {
  try {
    const { UserName } = req.body;

    if (!UserName) {
      return res.status(400).json({ error: "UserName is required" });
    }

    const query = `
    SELECT UserName, USR.EmployeeId, USR.UserId, EMP.FactoryId
    FROM UserMaster USR
    INNER JOIN EmployeeMaster EMP ON EMP.EmployeeId = USR.EmployeeId
    WHERE UserName = @UserName
  `;

    const request = pool.request();
    request.input("UserName", sql.VarChar, UserName);
    const result = await request.query(query);  
    console.log(result, "sssss");
    // Log the query result
    console.log("Query result:", result.recordset);

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.recordset[0];
    const { UserName: retrievedUserName, EmployeeId, UserId, FactoryId } = user;

    // Log extracted user details
    console.log("Extracted User Details:", {
      retrievedUserName,
      EmployeeId,
      UserId,
      FactoryId,
    });

    // Ensure all necessary data is present
    if (!UserId || FactoryId === undefined || FactoryId === null) {
      console.error("Error: Missing required fields");
      return res.status(500).json({ error: "Internal server error" });
    }

    // Generate JWT token
    const token = generateJWT(retrievedUserName, EmployeeId, UserId, FactoryId);

    res
      .status(200)
      .json({
        message: "Login successful",
        token,
        EmployeeId,
        UserId,
        FactoryId,
      });
  } catch (error) {
    console.error("Error logging in:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
