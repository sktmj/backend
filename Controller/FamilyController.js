import pool from "../config/db.js";

export const getlanguages = async (req,res)=>{
    try {
        const result = await pool.request().query("SELECT * FROM Languagues")
        res.json(result.recordset)
    } catch (error) {
        console.error("Error fetching Languages: ", error.message);
        res.status(500).json({error: "Error fetching Languages"})
        
    }
}

export const FamilyDetails = async (req, res) => {
  console.log( req.headers.authorization.split(' ')[1])
  try {
 

    const { Relation, Name, Age, Work, MonthSalary, PhoneNo } = req.body;
    const AppId = req.headers.authorization.split(' ')[1];
        
    if (!AppId) {
        return res.status(404).json({ success: false, message: "AppId not found in session" });
    }
    const query = `
      INSERT INTO AppFamilyDtl (AppId, Relation, Name, Age, Work, MonthSalary, PhoneNo)
      VALUES (@AppId, @Relation, @Name, @Age, @Work, @MonthSalary, @PhoneNo)
    `;

    const request = pool.request();

    request.input("AppId", AppId);
    request.input("Relation", Relation);
    request.input("Name", Name);
    request.input("Age", Age);
    request.input("Work", Work);
    request.input("MonthSalary", MonthSalary);
    request.input("PhoneNo", PhoneNo);

    const result = await request.query(query);

    if (result.rowsAffected[0] > 0) {
      console.log("Family Details inserted successfully");
      res.status(200).json({ success: true, message: "Family Details inserted successfully" });
    } else {
      console.error("Failed to insert Family Details");
      res.status(404).json({ success: false, message: "Failed to insert Family Details" });
    }
  } catch (error) {
    console.error("Error inserting Family Details:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
  

export const LanguaguesController = async (req, res) => {
  console.log( req.headers.authorization.split(' ')[1])
    try {
   
        const { LanId,LanSpeak,LanRead,LanWrite } = req.body;
       // Retrieve the AppId associated with the logged-in user from the session
       const AppId = req.headers.authorization.split(' ')[1];
        
       if (!AppId) {
           return res.status(404).json({ success: false, message: "AppId not found in session" });
       }

    // SQL query to insert values into AppQualification
    const query = `
      INSERT INTO AppLanguage (AppId,LanId,LanSpeak,LanRead,LanWrite)
      VALUES (@AppId, @LanId, @LanSpeak, @LanRead, @LanWrite)
    `;

    // Create a new request using the pool
    const request = pool.request();

    // Input parameters for the query
    request.input("AppId", AppId);
    request.input("LanId", LanId);
    request.input("LanSpeak", LanSpeak);
    request.input("LanRead", LanRead);
    request.input("LanWrite", LanWrite);


    // Execute the query
    const result = await request.query(query);

    // Check if any rows were affected
    if (result.rowsAffected[0] > 0) {
      console.log("Language Details inserted successfully");
      res.status(200).json({ success: true, message: " Language Details inserted successfully" });
    } else {
      console.error("Failed to insert Language Details ");
      res.status(404).json({ success: false, message: "Failed to insert Language Details" });
    }
  } catch (error) {
    console.error("Error inserting Language Details:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
