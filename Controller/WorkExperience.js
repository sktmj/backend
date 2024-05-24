import pool from "../config/db.js";
import multer from "multer";
import fs from "fs";
import path from "path";

export const getDesignation = async (req, res) => {
  try {
    const result = await pool
      .request()
      .query("SELECT * FROM DesignationMaster");
    res.json(result.recordset);
  } catch (error) {
    console.error("Error fetching Designation: ", error.message);
    res.status(500).json({ error: "Error fetching Designation" });
  }
};

export const InsertExperience = async (req, res) => {
  console.log(req.headers.authorization.split(" ")[1]);

  try {
    const {
      CompName,
      Designation,
      Duration,
      LastSalary,
      RelieveReason,
      RefPerson,
      PhoneNo,
      FrmMnth,
      FrmYr,
      ToMnth,
      ToYr,
      InitSalary,
      LastCompany,
    } = req.body;
    const AppId = req.headers.authorization.split(" ")[1];

    if (!AppId) {
      return res
        .status(404)
        .json({ success: false, message: "AppId not found in session" });
    }

    const query = `INSERT INTO AppWorkExp (CompName, Designation, Duration, LastSalary, RelieveReason, RefPerson, PhoneNo, FrmMnth, FrmYr, ToMnth, ToYr, InitSalary, LastCompany, AppId)
        OUTPUT INSERTED.ExpId
        VALUES (@CompName, @Designation, @Duration, @LastSalary, @RelieveReason, @RefPerson, @PhoneNo, @FrmMnth, @FrmYr, @ToMnth, @ToYr, @InitSalary, @LastCompany, @AppId)`;

    const request = pool.request();

    request.input("CompName", CompName);
    request.input("Designation", Designation);
    request.input("Duration", Duration || 0); // Default to 0 if Duration is null
    request.input("LastSalary", LastSalary || 0); // Default to 0 if LastSalary is null
    request.input("RelieveReason", RelieveReason);
    request.input("RefPerson", RefPerson);
    request.input("PhoneNo", PhoneNo || ""); // Default to empty string if PhoneNo is null
    request.input("FrmMnth", FrmMnth);
    request.input("FrmYr", FrmYr);
    request.input("ToMnth", ToMnth);
    request.input("ToYr", ToYr);
    request.input("InitSalary", InitSalary || 0); // Default to 0 if InitSalary is null
    request.input("LastCompany", LastCompany);
    request.input("AppId", AppId);
    const result = await request.query(query);
    // Check if any rows were affected
    if (result.recordset.length > 0) {
      const ExpId = result.recordset[0].ExpId;
      req.session.ExpId = ExpId;
      console.log("Experience inserted successfully with ExpId:", ExpId);
      res
        .status(200)
        .json({
          success: true,
          message: "Experience  inserted successfully",
          ExpId,
        });
    } else {
      console.error("Failed to insert Experience ");
      res
        .status(404)
        .json({ success: false, message: "Failed to insertExperience" });
    }
  } catch (error) {
    console.error("Error inserting Experience :", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const UpdateWorkExperience = async (req, res) => {
  console.log(req.body, "jsssss");

  try {
    const {
      WorkCompany,
      RelieveReason,
      EPFNO,
      UANNO,
      RegExpExNo,
      SalesExp,
      HealthIssue,
      IsDriving,
      LicenseNo,
      IsCompWrkHere,
      CarLicense,
    } = req.body;

    const AppId = req.headers.authorization.split(" ")[1];

    if (!AppId) {
      return res
        .status(404)
        .json({ success: false, message: "AppId not found in session" });
    }

    const query = `
    UPDATE ApplicationForm
    SET WorkCompany = @WorkCompany,
        RelieveReason = @RelieveReason,
        EPFNO = @EPFNO,
        UANNO = @UANNO,
        RegExpExNo = @RegExpExNo,
        SalesExp = @SalesExp,
        HealthIssue = @HealthIssue,
        IsDriving = @IsDriving,
        LicenseNo = @LicenseNo,
        IsCompWrkHere = @IsCompWrkHere,
        CarLicense = @CarLicense
    WHERE AppId = @AppId 
`;

    const request = pool.request();
    request.input("WorkCompany", WorkCompany);
    request.input("RelieveReason", RelieveReason);
    request.input("EPFNO", EPFNO);
    request.input("UANNO", UANNO);
    request.input("RegExpExNo", RegExpExNo);
    request.input("SalesExp", SalesExp);
    request.input("HealthIssue", HealthIssue);
    request.input("IsDriving", IsDriving);
    request.input("LicenseNo", LicenseNo);
    request.input("IsCompWrkHere", IsCompWrkHere);
    request.input("CarLicense", CarLicense);
    request.input("AppId", AppId);

    const result = await request.query(query);

    // Check if any rows were affected
    if (result.rowsAffected[0] > 0) {
      console.log("Work experience updated successfully");
      res
        .status(200)
        .json({
          success: true,
          message: "Work experience updated successfully",
        });
    } else {
      console.error("Failed to update work experience");
      res
        .status(404)
        .json({ success: false, message: "Failed to update work experience" });
    }
  } catch (error) {
    console.error("Error updating work experience:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
const __dirname = path.resolve();

export const uploadCarLicenseDoc = (req, res) => {
  try {
    // Get the AppId from the session
    const { AppId } = req.session;

    console.log("File upload request received:", req.file);

    // Check if a file was uploaded
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const fileName = req.file.originalname; // Get the original file name
    const filePath = path.join(__dirname, "public", "uploads", fileName); // Construct the file path

    console.log("File path:", filePath);

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, async (err) => {
      if (err) {
        // File does not exist
        console.error("File not found:", err);
        return res
          .status(404)
          .json({ success: false, message: "File not found" });
      }

      // File exists, continue processing

      try {
        // Update the database with the file name
        const query = `UPDATE ApplicationForm SET CarLicenseDoc = @CarLicenseDoc WHERE AppId = @AppId`;
        const request = pool.request();
        request.input("CarLicenseDoc", fileName);
        request.input("AppId", AppId);
        const result = await request.query(query);

        if (result.rowsAffected[0] > 0) {
          console.log("File name updated successfully in the database");
          res
            .status(200)
            .json({
              success: true,
              message: "File name updated successfully in the database",
              fileName,
            });
        } else {
          console.error("Failed to update database");
          res
            .status(404)
            .json({ success: false, message: "Failed to update database" });
        }
      } catch (error) {
        console.error("Error updating database:", error.message);
        res
          .status(500)
          .json({ success: false, message: "Error updating database" });
      }
    });
  } catch (error) {
    console.error("Error uploading file:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getExperience = async (req, res) => {
  console.log(req.headers.authorization.split(" ")[1], "hsssss");
  try {
    const AppId = req.headers.authorization.split(" ")[1];

    if (!AppId) {
      return res
        .status(404)
        .json({ success: false, message: "AppId not found in session" });
    }

    const query = `
        SELECT APP.*, DEI.DesignationName
        FROM AppWorkExp APP
        INNER JOIN DesignationMaster DEI ON DEI.DesignationId = APP.Designation
        WHERE AppId = @AppId
      `;

    const request = pool.request();
    request.input("AppId", AppId);

    const result = await request.query(query);

    if (result.recordset.length > 0) {
      console.log("Experience retrieved successfully");
      res.status(200).json({ success: true, data: result.recordset });
    } else {
      console.error("No AppExperience found for the given AppId");
      res
        .status(404)
        .json({ success: false, message: "No AppExperience found" });
    }
  } catch (error) {
    console.error("Error fetching AppExperience:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateAppExperience = async (req, res) => {
  console.log(req.body, "jsssss");
  try {
    // Destructuring request body
    const {
      ExpId,
      CompName,
      Designation,
      Duration,
      LastSalary,
      RelieveReason,
      RefPerson,
      PhoneNo,
      FrmMnth,
      FrmYr,
      ToMnth,
      ToYr,
      InitSalary,
      LastCompany,
    } = req.body;
    console.log(ExpId, "jajajajajajaj");
    // Extracting AppId from authorization header
    const AppId = req.headers.authorization?.split(" ")[1];

    // Checking if AppId exists
    if (!AppId) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Unauthorized: AppId not found in session",
        });
    }

    // Updating query
    const query = `
      UPDATE AppWorkExp
      SET CompName= @CompName, Designation = @Designation,  Duration = @Duration,
      LastSalary = @LastSalary,RelieveReason= @RelieveReason,RefPerson= @RefPerson,PhoneNo = @PhoneNo,FrmMnth = @FrmMnth,FrmYr =@FrmYr, ToMnth = @ToMnth,ToYr = @ToYr,InitSalary = @InitSalary,LastCompany= @LastCompany
      WHERE AppId = @AppId AND ExpId= @ExpId;
    `;

    // Executing the query
    const result = await pool
      .request()
      .input("AppId", AppId)
      .input("ExpId", ExpId) // Ensure AppQualId is properly passed
      .input("CompName", CompName)
      .input("Designation", Designation)
      .input("Duration", Duration)
      .input("LastSalary", LastSalary)
      .input("RefPerson", RefPerson)
      .input("RelieveReason", RelieveReason)
      .input("PhoneNo", PhoneNo)
      .input("FrmMnth", FrmMnth)
      .input("FrmYr", FrmYr)
      .input("ToMnth", ToMnth)
      .input("ToYr", ToYr)
      .input("InitSalary", InitSalary)
      .input("LastCompany", LastCompany)

      .query(query);
    // Checking if any row was affected
    if (result.rowsAffected[0] > 0) {
      console.log("Experience updated successfully");
      res
        .status(200)
        .json({ success: true, message: "Experience updated successfully" });
    } else {
      console.error("Failed to update Experience");
      res
        .status(404)
        .json({
          success: false,
          message: "Failed to update Experience: Record not found",
        });
    }
  } catch (error) {
    console.error("Error updating Experience:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getExperienceDetails = async (req, res) => {
  try {
    const AppId = req.headers.authorization.split(" ")[1];

    if (!AppId) {
      return res
        .status(404)
        .json({ success: false, message: "AppId not found in session" });
    }

    const query = `
            SELECT *
            FROM ApplicationForm
            WHERE AppId = @AppId
          `;

    const request = pool.request();
    request.input("AppId", AppId);

    const result = await request.query(query);

    if (result.recordset.length > 0) {
      console.log("AppQualifications retrieved successfully");
      res.status(200).json({ success: true, data: result.recordset });
    } else {
      console.error("No AppQualifications found for the given AppId");
      res
        .status(404)
        .json({ success: false, message: "No AppQualifications found" });
    }
  } catch (error) {
    console.error("Error fetching AppQualifications:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
