
import pool from "../config/db.js";


const JWT_KEY = "jsjsjsjsjsj";

export const getCourses= async (req, res) => {
        // Logic to fetch all countries from the database
        pool
          .request()
          .query("SELECT * FROM QualificationMaster")
          .then((result) => {
            res.json(result.recordset);
          })
          .catch((err) => {
            console.error("Error fetching Qulification:", err);
            res.status(500).json({ error: "Error fetching Qulification" });
          });
      };
      

      export const Qulification= async (req, res, next) => {
        const token = req.header("Authorization");
        if (!token) {
          return res.status(401).json({ error: "Access denied. No token provided." });
        }
      
        try {
          // Verify the JWT token
          const decoded = jwt.verify(token, JWT_KEY);
          req.user = decoded.user;
      
          // Extract necessary data from the request body
          const { QualId, ColName, YearPass, Percentage, Degree, LastDegree, Location } = req.body;
      
          // Insert data into the AppQualification table
          await insertAppQualification({
            AppId: req.user.userName, // Use the authenticated user's username as AppId
            QualId,
            ColName,
            YearPass,
            Percentage,
            Degree,
            LastDegree,
            Location
          });
      
          // Proceed to the next middleware
          next();
        } catch (error) {
          console.error("Error verifying token and inserting data:", error.message);
          res.status(401).json({ error: "Invalid token" });
        }
      };