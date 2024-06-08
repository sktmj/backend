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
  console.log(req.body,"sssss")
  try {
    const { QualId, ColName, YearPass, Percentage, Degree, LastDegree, Location } = req.body;

    const AppId = req.headers.authorization.split(' ')[1];

    if (!AppId) {
      return res.status(404).json({ success: false, message: "AppId not found in session" });
    }

    const query = `
      INSERT INTO AppQualification (AppId, QualId, ColName, YearPass, Percentage, Degree, LastDegree, Location)
      OUTPUT INSERTED.AppQualId
      VALUES (@AppId, @QualId, @ColName, @YearPass, @Percentage, @Degree, @LastDegree, @Location)
    `;

    const request = pool.request();

    request.input("AppId", AppId);
    request.input("QualId", QualId);
    request.input("ColName", ColName);
    request.input("YearPass", YearPass);
    request.input("Percentage", Percentage);
    request.input("Degree", Degree);
    request.input("LastDegree", LastDegree);
    request.input("Location", Location);

    const result = await request.query(query);

    if (result.recordset.length > 0) {
      const AppQualId = result.recordset[0].AppQualId;
      req.session.AppQualId = AppQualId; // Store AppQualId in session

      console.log("AppQualification inserted successfully with AppQualId:", AppQualId);
      res.status(200).json({ success: true, message: "AppQualification inserted successfully", AppQualId });
    } else {
      console.error("Failed to insert AppQualification");
      res.status(404).json({ success: false, message: "Failed to insert AppQualification" });
    }
  } catch (error) {
    console.error("Error inserting AppQualification:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteAppQualification = async (req, res) => {
  try {
    const { AppQualId } = req.params; // Get AppQualId from URL parameters

    if (!AppQualId) {
      return res.status(400).json({ success: false, message: "AppQualId is required" });
    }

    const query = `
      DELETE FROM AppQualification
      WHERE AppQualId = @AppQualId
    `;

    const request = pool.request();
    request.input("AppQualId", AppQualId);

    const result = await request.query(query);

    if (result.rowsAffected[0] > 0) {
      console.log("AppQualification deleted successfully");
      res.status(200).json({ success: true, message: "AppQualification deleted successfully" });
    } else {
      console.error("Failed to delete AppQualification");
      res.status(404).json({ success: false, message: "Failed to delete AppQualification" });
    }
  } catch (error) {
    console.error("Error deleting AppQualification:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const updateAppQualification = async (req, res) => {
console.log(req.body,"jsjsjsjsj")
try {
  // Destructuring request body
  const { AppQualId, QualId, ColName, YearPass, Percentage, Degree, LastDegree, Location } = req.body;
console.log(AppQualId,"jajajajajajaj")
  // Extracting AppId from authorization header
  const AppId = req.headers.authorization?.split(' ')[1];

  // Checking if AppId exists
  if (!AppId) {
    return res.status(401).json({ success: false, message: "Unauthorized: AppId not found in session" });
  }

  // Updating query
  const query = `
    UPDATE AppQualification
    SET QualId = @QualId, ColName = @ColName, YearPass = @YearPass, Percentage = @Percentage,
        Degree = @Degree, LastDegree = @LastDegree, Location = @Location
    WHERE AppId = @AppId AND AppQualId = @AppQualId;
  `;

  // Executing the query
  const result = await pool.request()
    .input("AppId", AppId)
    .input("AppQualId", AppQualId) // Ensure AppQualId is properly passed
    .input("QualId", QualId)
    .input("ColName", ColName)
    .input("YearPass", YearPass)
    .input("Percentage", Percentage)
    .input("Degree", Degree)
    .input("LastDegree", LastDegree)
    .input("Location", Location)
    .query(query);

  // Checking if any row was affected
  if (result.rowsAffected[0] > 0) {
    console.log("AppQualification updated successfully");
    res.status(200).json({ success: true, message: "AppQualification updated successfully" });
  } else {
    console.error("Failed to update AppQualification");
    res.status(404).json({ success: false, message: "Failed to update AppQualification: Record not found" });
  }
} catch (error) {
  console.error("Error updating AppQualification:", error.message);
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
      OUTPUT INSERTED.CourseId
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
    if (result.recordset.length > 0) {
      const CourseId = result.recordset[0].CourseId;
      req.session.CourseId = CourseId; // Store in session

      console.log("AppCourse inserted successfully with CourseId:", CourseId);
      res.status(200).json({ success: true, message: "AppCourse  inserted successfully",CourseId });
    } else {
      console.error("Failed to insert AppCourse ");
      res.status(404).json({ success: false, message: "Failed to insert AppCourse " });
    }
  } catch (error) {
    console.error("Error inserting AppCourse :", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { CourseId } = req.params; // Get AppQualId from URL parameters

    if (!CourseId) {
      return res.status(400).json({ success: false, message: "CourseId is required" });
    }

    const query = `
      DELETE FROM  AppCourse
      WHERE CourseId = @CourseId
    `;

    const request = pool.request();
    request.input("CourseId", CourseId);

    const result = await request.query(query);

    if (result.rowsAffected[0] > 0) {
      console.log("Course deleted successfully");
      res.status(200).json({ success: true, message: "Course deleted successfully" });
    } else {
      console.error("Failed to delete Course");
      res.status(404).json({ success: false, message: "Failed to delete Course" });
    }
  } catch (error) {
    console.error("Error deleting Course:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateAppCourse = async (req, res) => {
  console.log(req.body,"jsssss")
  try {
    // Destructuring request body
    const { CourseId, Course, Institute, StudYear,CrsPercentage} = req.body;
  console.log( CourseId,"jajajajajajaj")
    // Extracting AppId from authorization header
    const AppId = req.headers.authorization?.split(' ')[1];
  
    // Checking if AppId exists
    if (!AppId) {
      return res.status(401).json({ success: false, message: "Unauthorized: AppId not found in session" });
    }
  
    // Updating query
    const query = `
    UPDATE AppCourse
    SET Course = @Course, Institute = @Institute,  StudYear = @StudYear,
    CrsPercentage = @CrsPercentage
    WHERE AppId = @AppId AND CourseId= @CourseId;
  `;
  
    // Executing the query
    const result = await pool.request()
    .input("AppId", AppId)
    .input("CourseId", CourseId ) // Ensure AppQualId is properly passed
    .input("Course",  Course)
    .input("Institute", Institute)
    .input("StudYear", StudYear)
    .input("CrsPercentage",CrsPercentage)
    .query(query);
    // Checking if any row was affected
    if (result.rowsAffected[0] > 0) {
      console.log("AppQualification updated successfully");
      res.status(200).json({ success: true, message: "AppQualification updated successfully" });
    } else {
      console.error("Failed to update AppQualification");
      res.status(404).json({ success: false, message: "Failed to update AppQualification: Record not found" });
    }
  } catch (error) {
    console.error("Error updating AppQualification:", error.message);
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
    SELECT APP.*, QL.QualificationName
    FROM AppQualification APP
    INNER JOIN QualificationMaster QL ON QL.QualificationId = APP.QualId
    WHERE APP.AppId = @AppId
  `;

   console.log(query,"jjjajajajajajaj")

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