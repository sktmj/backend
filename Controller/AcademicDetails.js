import pool from "../config/db.js";
import jwt from "jsonwebtoken"; // Import JWT for authentication

const JWT_KEY = "123dd"

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
//   console.log(req.headers.authorization)
// console.log(req.headers.authorization.split(' ')[1])
  try {
        
    
    const { QualId, ColName, YearPass, Percentage, Degree, LastDegree, Location } = req.body;

    const AppId = req.headers.authorization.split(' ')[1];
        
    if (!AppId) {
        return res.status(404).json({ success: false, message: "AppId not found in session" });
    }


    const query = `
      INSERT INTO AppQualification (AppId, QualId, ColName, YearPass, Percentage, Degree, LastDegree, Location)
      VALUES (@AppId, @QualId, @ColName, @YearPass, @Percentage, @Degree, @LastDegree, @Location)
    `;

    const request = pool.request();

    request.input("AppId", AppId); // Use the retrieved AppId
    request.input("QualId", QualId);
    request.input("ColName", ColName);
    request.input("YearPass", YearPass);
    request.input("Percentage", Percentage);
    request.input("Degree", Degree);
    request.input("LastDegree", LastDegree);
    request.input("Location", Location);

    const result = await request.query(query);

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
  console.log(req.headers.authorization.split(' ')[1],"ssssss")
  try {
     
    // Destructure necessary inputs from request body
    const { Course, Institute, StudYear, CrsPercentage } = req.body;
    const AppId = req.headers.authorization.split(' ')[1];
        
    if (!AppId) {
        return res.status(404).json({ success: false, message: "AppId not found in session" });
    }

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
    request.input("CrsPercentage", CrsPercentage);

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


export const  getCourseDetails = async (req, res) => {
  console.log(req.headers.authorization.split(' ')[1],"hiiiiiii")
  try {
    const AppId = req.headers.authorization.split(' ')[1];
    
    if (!AppId) {
      return res.status(404).json({ success: false, message: "AppId not found in session" });
    }

    const query = `
      SELECT *
      FROM AppCourse
      WHERE AppId = @AppId
    `;

    const request = pool.request();
    request.input("AppId", AppId);

    const result = await request.query(query);

    if (result.recordset.length > 0) {
      console.log("AppCourse retrieved successfully");
      res.status(200).json({ success: true, data: result.recordset });
    } else {
      console.error("No AppCourse found for the given AppId");
      res.status(404).json({ success: false, message: "No AppCourse found" });
    }
  } catch (error) {
    console.error("Error fetching AppCourse:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const  getQulificationDetails = async (req, res) => {
  console.log(req.headers.authorization.split(' ')[1],"hiiiiiii")
  try {
    const AppId = req.headers.authorization.split(' ')[1];
    
    if (!AppId) {
      return res.status(404).json({ success: false, message: "AppId not found in session" });
    }

    const query = `
      SELECT *
      FROM AppQualification
      WHERE AppId = @AppId
    `;

    const request = pool.request();
    request.input("AppId", AppId);

    const result = await request.query(query);

    if (result.recordset.length > 0) {
      console.log("Qualification retrieved successfully");
      res.status(200).json({ success: true, data: result.recordset });
    } else {
      console.error("No AppCourse found for the given AppId");
      res.status(404).json({ success: false, message: "No Qualification  found" });
    }
  } catch (error) {
    console.error("Error fetching AppCourse:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};