import { pool } from "../config/db.js";


export const getlanguages = async (req, res) => {
  try {
    const result = await pool.request().query("SELECT * FROM Languagues");
    res.json(result.recordset);
  } catch (error) {
    console.error("Error fetching Languages: ", error.message);
    res.status(500).json({ error: "Error fetching Languages" });
  }
};

export const FamilyDetails = async (req, res) => {
  console.log(req.body, "ssssssss");
  try {
    const { Relation, Name, Age, Work, MonthSalary, PhoneNo } = req.body;
    const AppId = req.headers.authorization.split(" ")[1];

    if (!AppId) {
      return res
        .status(404)
        .json({ success: false, message: "AppId not found in session" });
    }
    const query = `
      INSERT INTO AppFamilyDtl (AppId, Relation, Name, Age, Work, MonthSalary, PhoneNo)
      OUTPUT INSERTED.FamilyId
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

    if (result.recordset.length > 0) {
      const FamilyId = result.recordset[0].FamilyId;
      req.session.FamilyId = FamilyId; // Store in session

      console.log(
        "FamilyDetails  inserted successfully with FamilyId:",
        FamilyId
      );
      res
        .status(200)
        .json({
          success: true,
          message: "FamilyDetails   inserted successfully", 
          FamilyId,
        });
    } else {
      console.error("Failed to insert FamilyDetails  ");
      res 
        .status(404)
        .json({ success: false, message: "Failed to insert FamilyDetails  " });
    }
  } catch (error) {
    console.error("Error inserting FamilyDetails  :", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const deleteFamily = async (req, res) => {
  try {
    const { FamilyId } = req.params; // Get AppQualId from URL parameters

    if (!FamilyId) {
      return res.status(400).json({ success: false, message: "FamilyId is required" });
    }

    const query = `
      DELETE FROM  AppFamilyDtl
      WHERE FamilyId = @FamilyId
    `;

    const request = pool.request();
    request.input("FamilyId", FamilyId);

    const result = await request.query(query);

    if (result.rowsAffected[0] > 0) {
      console.log("Family deleted successfully");
      res.status(200).json({ success: true, message: "Family deleted successfully" });
    } else {
      console.error("Failed to delete Family");
      res.status(404).json({ success: false, message: "Failed to delete Family" });
    }
  } catch (error) {
    console.error("Error deleting Family:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



export const getLanguageDetails = async (req, res) => {
  try {
    const AppId = req.headers.authorization.split(" ")[1]; // Extract AppId from the header

    if (!AppId) {
      return res
        .status(404)
        .json({ success: false, message: "AppId not found in session" });
    }

    const query = `
      SELECT *
      FROM AppLanguage
      WHERE AppId = @AppId
    `;

    const request = daivelPool.request();
    request.input("AppId", AppId);

    const result = await request.query(query);

    if (result.recordset.length > 0) {
      res.status(200).json({ success: true, data: result.recordset });
    } else {
      res
        .status(404)
        .json({ success: false, message: "No Languages found" });
    }
  } catch (error) {
    console.error("Error fetching Languages:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getFamilyDetails = async (req, res) => {
  try {
    const AppId = req.headers.authorization.split(" ")[1]; // Extract AppId from the header

    if (!AppId) {
      return res
        .status(404)
        .json({ success: false, message: "AppId not found in session" });
    }

    const query = `
      SELECT *
      FROM AppFamilyDtl
      WHERE AppId = @AppId
    `;

    const request = pool.request();
    request.input("AppId", AppId);

    const result = await request.query(query);

    if (result.recordset.length > 0) {
      res.status(200).json({ success: true, data: result.recordset });
    } else {
      res
        .status(404)
        .json({ success: false, message: "No FamilyDetails found" });
    }
  } catch (error) {
    console.error("Error fetching FamilyDetails:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const LanguaguesController = async (req, res) => {
  console.log(req.body, "shivaneshhhhhhhhhhhhhh");
  try {
    const { LanId, LanSpeak, LanRead, LanWrite } = req.body;
    // Retrieve the AppId associated with the logged-in user from the session
    const AppId = req.headers.authorization.split(" ")[1];

    if (!AppId) {
      return res
        .status(404)
        .json({ success: false, message: "AppId not found in session" });
    }

    // SQL query to insert values into AppQualification
    const query = `
      INSERT INTO AppLanguage (AppId,LanId,LanSpeak,LanRead,LanWrite)
      OUTPUT INSERTED.AppLanId
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
    if (result.recordset.length > 0) {
      const AppLanId = result.recordset[0].AppLanId;
      req.session.AppLanId = AppLanId; // Store in session

      console.log(" Languagues inserted successfully with AppLanId:", AppLanId);
      res
        .status(200)
        .json({
          success: true,
          message: " Languagues  inserted successfully",
          AppLanId,
        });
    } else {
      console.error("Failed to insert  Languagues  ");
      res
        .status(404)
        .json({ success: false, message: "Failed to insert  Languagues " });
    }
  } catch (error) {
    console.error("Error inserting  Languagues :", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteLanguages = async (req, res) => {
  try {
    const { AppLanId } = req.params; // Get AppQualId from URL parameters

    if (!AppLanId) {
      return res.status(400).json({ success: false, message: "FamilyId is required" });
    }

    const query = `
      DELETE FROM  AppLanguage
      WHERE AppLanId = @AppLanId
    `;

    const request = pool.request();
    request.input("AppLanId", AppLanId);

    const result = await request.query(query);

    if (result.rowsAffected[0] > 0) {
      console.log("Languages deleted successfully");
      res.status(200).json({ success: true, message: "Languages deleted successfully" });
    } else {
      console.error("Failed to delete Languages");
      res.status(404).json({ success: false, message: "Failed to delete Languages" });
    }
  } catch (error) {
    console.error("Error deleting Languages:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



export const UpdateFamilyDetails = async (req, res) => {
  console.log(req.body, "jsssss");

  try {
    const { FamilyId,Relation, Name, Age, Work, MonthSalary, PhoneNo } = req.body;
   console.log(FamilyId,"hhhhh")
    const AppId = req.headers.authorization.split(" ")[1];

    if (!AppId) {
      return res
        .status(404)
        .json({ success: false, message: "AppId not found in session" });
    }

    const query = `
    UPDATE AppFamilyDtl
    SET Relation=@Relation,
          Name=@Name,
          Age=@Age,
          Work=@Work,
          MonthSalary=@MonthSalary,
          PhoneNo=@PhoneNo
          WHERE AppId = @AppId AND FamilyId= @FamilyId
`;

    const request = pool.request();
    request.input("Relation", Relation);
    request.input("FamilyId",FamilyId)
    request.input("Name",  Name);
    request.input("Age", Age);
    request.input("Work", Work);
    request.input("MonthSalary", MonthSalary);
    request.input("PhoneNo", PhoneNo);
    request.input("AppId", AppId);

    const result = await request.query(query);

    // Check if any rows were affected
    if (result.rowsAffected[0] > 0) {
      console.log("family details updated successfully");
      res.status(200).json({
        success: true,
        message: "family details updated successfully",
      });
    } else {
      console.error("Failed to update family details");
      res
        .status(404)
        .json({ success: false, message: "Failed to update family details" });
    }
  } catch (error) {
    console.error("Error updating family details:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const UpdateLanguagesDetails = async (req, res) => {
  console.log(req.body, "jsssss");

  try {
    const { AppLanId, LanId, LanSpeak, LanRead, LanWrite } = req.body;
    console.log(AppLanId, "hhhhh");
    const AppId = req.headers.authorization.split(" ")[1];

    if (!AppId) {
      return res
        .status(404)
        .json({ success: false, message: "AppId not found in session" });
    }

    const query = `
      UPDATE AppLanguage
      SET LanId = @LanId,
          LanSpeak = @LanSpeak,
          LanRead = @LanRead,
          LanWrite = @LanWrite
          WHERE AppId = @AppId AND  AppLanId = @AppLanId
    `;

    const request = pool.request();
    request.input("AppLanId", AppLanId);
    request.input("LanWrite", LanWrite);
    request.input("LanRead", LanRead);
    request.input("LanSpeak", LanSpeak);
    request.input("LanId", LanId);
    request.input("AppId", AppId);

    const result = await request.query(query);

    // Check if any rows were affected
    if (result.rowsAffected[0] > 0) {
      console.log("Languages details updated successfully");
      res.status(200).json({
        success: true,
        message: "Languages details updated successfully",
      });
    } else {
      console.error("Failed to update Languages details");
      res
        .status(404)
        .json({ success: false, message: "Failed to update Languages details" });
    }
  } catch (error) {
    console.error("Error updating Languages details:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
