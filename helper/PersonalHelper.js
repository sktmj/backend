import sql from "mssql";
import { config } from "../config/db.js";

export const getCastesByReligion = async (religion_gid) => {
  try {
    if (isNaN(religion_gid)) {
      throw new Error("Invalid religion_gid. Must be a number.");
    }

    const pool = await sql.connect(config);
    religion_gid = parseInt(religion_gid);

    const result = await pool
      .request()
      .input("religion_gid", sql.Int, religion_gid)
      .query("SELECT * FROM Caste_master WHERE religion_gid = @religion_gid");

    return result.recordset;
  } catch (error) {
    console.error("Error fetching castes by religion:", error.message);
    throw error;
  }
};



 export const checkIfUserExists = async (UserName) => {
  try {
    // Create a new SQL connection pool
    const pool = await sql.connect(config);

    // Prepare the SQL query
    const query = `SELECT COUNT(*) AS userCount FROM ApplicationForm WHERE UserName = @UserName`;

    // Prepare the SQL request
    const request = pool.request();
    request.input('UserName', sql.NVarChar, UserName);

    // Execute the query
    const result = await request.query(query);

    // Check if the user count is greater than 0
    const userCount = result.recordset[0].userCount;
    return userCount > 0;
  } catch (error) {
    console.error('Error checking user existence:', error.message);
    throw error;
  }
};


// Define getType function to map JavaScript types to SQL data types
export const getType = (value) => {
  switch (typeof value) {
    case 'string':
      return sql.NVarChar;
    case 'number':
      return sql.Int;
    case 'boolean':
      return sql.Bit;
    case 'object':
      if (value instanceof Date) {
        return sql.DateTime;
      } else if (Array.isArray(value)) {
        return sql.NVarChar; // Assuming array values will be converted to string
      }
    default:
      return sql.NVarChar;
  }
};
