
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { pool } from "../config/db.js";

export const uploadDrivingLic = async (req, res) => {
  try {
    const AppId = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;

    if (!AppId) {
      return res.status(404).json({ success: false, message: "AppId not found in session" });
    }

    // Validate if AppId is a number
    if (isNaN(AppId)) {
      return res.status(400).json({ success: false, message: "Invalid AppId" });
    }

    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const fileName = req.file.filename; // Use multer's generated filename
    const query = "UPDATE ApplicationForm SET CarLicenseDoc = @CarLicenseDoc WHERE AppId = @AppId";
    const request = pool.request();
    request.input("CarLicenseDoc", fileName);
    request.input("AppId", AppId);
    
    const result = await request.query(query);

    // Check if any rows were affected
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      console.log("Driving License updated successfully");
      res.status(200).json({
        success: true,
        message: "Driving License updated successfully",
      });
    } else {
      console.error("Failed to update Driving License");
      res.status(404).json({ success: false, message: "Failed to update Driving License" });
    }
  } catch (error) {
    console.error("Error updating Driving License:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
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

export const addExperience = async (req, res) => {
  console.log(req.body,"jsjsj")
  console.log(req.headers.authorization.split(" ")[1],"dkdkdkdkdkd")
  try {
    const { CompName, Designation, LastSalary, RelieveReason, RefPerson, PhoneNo, FrmMnth, FrmYr, ToMnth, ToYr, InitSalary, LastCompany } = req.body;
    const AppId = req.headers.authorization.split(" ")[1];

    if (!AppId) {
      return res.status(404).json({ success: false, message: "AppId not found in session" });
    }

    const query = `
      INSERT INTO AppWorkExp (AppId, CompName, Designation, LastSalary, RelieveReason, RefPerson, PhoneNo, FrmMnth, FrmYr, ToMnth, ToYr, InitSalary, LastCompany)
      OUTPUT INSERTED.ExpId
      VALUES (@AppId, @CompName, @Designation, @LastSalary, @RelieveReason, @RefPerson, @PhoneNo, @FrmMnth, @FrmYr, @ToMnth, @ToYr, @InitSalary, @LastCompany)
    `;

    const request = pool.request();
    request.input("AppId", AppId);
    request.input("CompName", CompName);
    request.input("Designation", Designation);
    request.input("LastSalary", LastSalary);
    request.input("RelieveReason", RelieveReason);
    request.input("RefPerson", RefPerson);
    request.input("PhoneNo", PhoneNo);
    request.input("FrmMnth", FrmMnth);
    request.input("FrmYr", FrmYr);
    request.input("ToMnth", ToMnth);
    request.input("ToYr", ToYr);
    request.input("InitSalary", InitSalary);
    request.input("LastCompany", LastCompany);

    const result = await request.query(query);

    if (result.recordset.length > 0) {
      const ExpId = result.recordset[0].ExpId;
      req.session.ExpId = ExpId; // Store in session

      console.log("Experience inserted successfully with ExpId:", ExpId);
      res.status(200).json({
        success: true,
        message: "Experience inserted successfully",
        ExpId,
      });
    } else {
      console.error("Failed to insert Experience");
      res.status(404).json({ success: false, message: "Failed to insert Experience" });
    }
  } catch (error) {
    console.error("Error inserting Experience:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
export const deleteExperience = async (req, res) => {
  try {
    const { ExpId } = req.params; // Get AppQualId from URL parameters

    if (!ExpId) {
      return res.status(400).json({ success: false, message: "ExpId is required" });
    }

    const query = `
      DELETE FROM  AppWorkExp
      WHERE ExpId = @ExpId
    `;

    const request = pool.request();
    request.input("ExpId", ExpId);

    const result = await request.query(query);

    if (result.rowsAffected[0] > 0) {
      console.log("Experience deleted successfully");
      res.status(200).json({ success: true, message: "Experience deleted successfully" });
    } else {
      console.error("Failed to delete Experience");
      res.status(404).json({ success: false, message: "Failed to delete Experience" });
    }
  } catch (error) {
    console.error("Error deleting Experience:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const UpdateWorkExperience = async (req, res) => {
  console.log(req.body,"aaaaaa")
  try {
    const {
      WorkCompany,
      RelieveReason,
      EPFNO,
      UANNO,
      IsPF,
      IsRegEmpEx,
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
          CarLicense = @CarLicense,
          IsPF = @IsPF,
          IsRegEmpEx = @IsRegEmpEx
      WHERE AppId = @AppId;
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
    request.input("IsPF", IsPF);
    request.input("IsRegEmpEx", IsRegEmpEx);
    request.input("AppId", AppId);

    const result = await request.query(query);

    // Check if any rows were affected
    if (result.rowsAffected[0] > 0) {
      console.log("Work experience updated successfully");
      res.status(200).json({
        success: true,
        message: "Work experience updated successfully",
      });
    } else {
      console.error("Failed to update work experience");
      res.status(404).json({
        success: false,
        message: "Failed to update work experience",
      });
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
  try {
    const AppId = req.headers.authorization.split(" ")[1]; // Extract AppId from the header

    if (!AppId) {
      return res
        .status(404)
        .json({ success: false, message: "AppId not found in session" });
    }

    const query = `
    SELECT *
    FROM AppWorkExp
    WHERE AppId = @AppId
  `;
    const request = pool.request();
    request.input("AppId", AppId);
    const result = await request.query(query);
    // Return appropriate response based on query result
    if (result.recordset.length > 0) {
      res.status(200).json({ success: true, data: result.recordset });
    } else {
      res.status(404).json({ success: false, message: "No experience details found" });
    }
  } catch (error) {
    console.error("Error fetching experience details:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateAppExperience = async (req, res) => {
  console.log(req.body, "updateeeeeee");
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
  console.log(req.headers.authorization.split(" ")[1])
  try {
    const AppId = req.headers.authorization.split(" ")[1];

    if (!AppId) {
      return res.status(404).json({ success: false, message: "AppId not found in session" });
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
      console.log("Experience details retrieved successfully");
      res.status(200).json({ success: true, data: result.recordset });
    } else {
      console.error("No experience details found for the given AppId");
      res.status(404).json({ success: false, message: "No experience details found for the given AppId" });
    }
  } catch (error) {
    console.error('Error fetching experience details:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch experience details' });
  }
};