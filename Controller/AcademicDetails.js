
import pool from "../config/db.js";


// const JWT_KEY = "jsjsjsjsjsj"; // Ensure this key matches the one used in the frontend

// Route controller for getting courses
export const getCourses = async (req, res) => {
  try {
    // Logic to fetch all courses from the database
    const result = await pool.request().query("SELECT * FROM QualificationMaster");
    res.json(result.recordset);
  } catch (error) {
    console.error("Error fetching courses:", error.message);
    res.status(500).json({ error: "Error fetching courses" });
  }
};

export const insertAppQualification = async (req, res) => {
  try {
    // Destructure necessary inputs from request body
    const { QualId, ColName, YearPass, Percentage, Degree, LastDegree, Location } = req.body;

    // Retrieve the AppId associated with the logged-in user from the session
    const AppId = req.session.AppId;

    // Check if AppId is undefined or not found in the session
    if (!AppId) {
      return res.status(404).json({ success: false, message: "AppId not found in session" });
    }

    // SQL query to insert values into AppQualification
    const query = `
      INSERT INTO AppQualification (AppId, QualId, ColName, YearPass, Percentage, Degree, LastDegree, Location)
      VALUES (@AppId, @QualId, @ColName, @YearPass, @Percentage, @Degree, @LastDegree, @Location)
    `;

    // Create a new request using the pool
    const request = pool.request();

    // Input parameters for the query
    request.input("AppId", AppId);
    request.input("QualId", QualId);
    request.input("ColName", ColName);
    request.input("YearPass", YearPass);
    request.input("Percentage", Percentage);
    request.input("Degree", Degree);
    request.input("LastDegree", LastDegree);
    request.input("Location", Location);

    // Execute the query
    const result = await request.query(query);

    // Check if any rows were affected
    if (result.rowsAffected[0] > 0) {
      console.log("AppQualification inserted successfully");
      res.status(200).json({ success: true, message: "AppQualification inserted successfully" });
    } else {
      console.error("Failed to insert AppQualification");
      res.status(404).json({ success: false, message: "Failed to insert AppQualification" });
    }
  } catch (error) {
    console.error("Error inserting AppQualification:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



export const insertAppCourse = async (req, res) => {
  try {
    // Destructure necessary inputs from request body
    const { Course, Institute, StudYear,CrsPercentage } = req.body;

    // Retrieve the AppId associated with the logged-in user from the session
    const AppId = req.session.AppId;

    // Check if AppId is undefined or not found in the session
    if (!AppId) {
      return res.status(404).json({ success: false, message: "AppId not found in session" });
    }

    // SQL query to insert values into AppCourse
    const query = `
      INSERT INTO AppCourse (Course, Institute, StudYear, AppId, CrsPercentage)
      VALUES (@Course, @Institute, @StudYear, @AppId, @CrsPercentage)
    `;

    // Create a new request using the pool
    const request = pool.request();

    // Input parameters for the query
    request.input("Course", Course);
    request.input("Institute", Institute);
    request.input("StudYear", StudYear);
    request.input("AppId", AppId);
    request.input("CrsPercentage",CrsPercentage);

    // Execute the query
    const result = await request.query(query);

    // Check if any rows were affected
    if (result.rowsAffected[0] > 0) {
      console.log("AppCourse inserted successfully");
      res.status(200).json({ success: true, message: "AppCourse inserted successfully" });
    } else {
      console.error("Failed to insert AppCourse");
      res.status(404).json({ success: false, message: "Failed to insert AppCourse" });
    }
  } catch (error) {
    console.error("Error inserting AppCourse:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
