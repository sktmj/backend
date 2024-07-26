
import jwt from "jsonwebtoken";
import pool from "../../config/db.js";

const JWT_KEY = "your_secret_key_here"; // Make sure to use a secure key

// Function to generate JWT token
const generateJWT = (UserName, EmployeeId, UserId) => {
  const payload = { UserName, EmployeeId, UserId };
  return jwt.sign(payload, JWT_KEY, { expiresIn: "1h" }); // Token expires in 1 hour
};

export const Adminlogin = async (req, res) => {
  try {
    const { UserName } = req.body;

    if (!UserName) {
      return res.status(400).json({ error: "UserName is required" });
    }

    // Query the database to retrieve user data including EmployeeId and UserId
    const query = `
      SELECT UserName, EmployeeId, UserId
      FROM UserMaster
      WHERE UserName = @UserName
    `;

    const request = pool.request();
    request.input("UserName", UserName);
    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.recordset[0];
    const { UserName: retrievedUserName, EmployeeId, UserId } = user;

    // Ensure UserId is not undefined or null before proceeding
    if (!UserId) {
      console.error("Error: UserId is undefined or null");
      return res.status(500).json({ error: "Internal server error" });
    }

    // Log UserName, EmployeeId, and UserId to the console
    console.log("UserName:", retrievedUserName);
    console.log("EmployeeId:", EmployeeId);
    console.log("UserId:", UserId);

    // Generate JWT token
    const token = generateJWT(retrievedUserName, EmployeeId, UserId);

    res.status(200).json({ message: "Login successful", token, EmployeeId,UserId });
  } catch (error) {
    console.error("Error logging in:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
