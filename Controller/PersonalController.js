// Your controller.js
import sql from "mssql";
import pool from "../config/db.js";
import { config } from "../config/db.js";

export const getReligionController = async (req, res) => {
  try {
    const result = await pool.request().query("SELECT * FROM Religion_master");
    res.json(result.recordset);
  } catch (error) {
    console.error("Error fetching religion:", error.message);
    res.status(500).json({ error: "Error fetching religion" });
  }
};

export const getCastesByReligion = async (req, res) => {
  try {
    const { religion_gid } = req.params; // Extract religion_gid from request parameters

    if (isNaN(religion_gid)) {
      throw new Error("Invalid religion_gid. Must be a number.");
    }

    // Connect to the database using the provided config
    const pool = await sql.connect(config);
    const religionId = parseInt(religion_gid);

    // Execute the SQL query to fetch castes by religion
    const result = await pool
      .request()
      .input("religion_gid", sql.Int, religionId)
      .query("SELECT * FROM Caste_master WHERE religion_gid = @religion_gid");

    // Send the fetched castes as response
    res.json(result.recordset);
  } catch (error) {
    console.error("Error fetching castes by religion:", error.message);
    res.status(500).json({ error: "Error fetching castes by religion" });
  }
};


export const getAllCountries = (req, res) => {
  // Logic to fetch all countries from the database
  pool
    .request()
    .query("SELECT * FROM Countries_master")
    .then((result) => {
      res.json(result.recordset);
    })
    .catch((err) => {
      console.error("Error fetching countries:", err);
      res.status(500).json({ error: "Error fetching countries" });
    });
};



// controllers/stateController.js
export const getStatesByCountryId = (req, res) => {
  // Logic to fetch states by country ID from the database
  const { countryId } = req.params;
  pool
    .request()
    .input("countryId", sql.Int, countryId)
    .query("SELECT * FROM States_master WHERE country_gid = @countryId")
    .then((result) => {
      res.json(result.recordset);
    })
    .catch((err) => {
      console.error("Error fetching states:", err);
      res.status(500).json({ error: "Error fetching states" });
    });
};



// controllers/districtController.js
export const getDistrictsByStateId = (req, res) => {
  // Logic to fetch districts by state ID from the database
  const { stateId } = req.params;
  pool
    .request()
    .input("stateId", sql.Int, stateId)
    .query("SELECT * FROM District WHERE StateId = @stateId") // Check if the column name is correct (StateId)
    .then((result) => {
      res.json(result.recordset);
    })
    .catch((err) => {
      console.error("Error fetching districts:", err);
      res.status(500).json({ error: "Error fetching districts" });
    });
};



// controllers/talukController.js
export const getTaluksByDistrictId = (req, res) => {
  // Logic to fetch taluks by district ID from the database
  const { districtId } = req.params;
  pool
    .request()
    .input("districtId", sql.Int, districtId)
    .query("SELECT * FROM Taluk WHERE DistrictId = @districtId")
    .then((result) => {
      res.json(result.recordset);
    })
    .catch((err) => {
      console.error("Error fetching taluks:", err);
      res.status(500).json({ error: "Error fetching taluks" });
    });
};



// controllers/cityController.js
export const getCitiesByTalukId = (req, res) => {
  // Logic to fetch cities by taluk ID from the database
  const { talukId } = req.params;
  pool
    .request()
    .input("talukId", sql.Int, talukId)
    .query("SELECT * FROM Cities_master WHERE TalukId = @talukId")
    .then((result) => {
      res.json(result.recordset);
    })
    .catch((err) => {
      console.error("Error fetching cities:", err);
      res.status(500).json({ error: "Error fetching cities" });
    });
};



export const personlController = async (req, res) => {
  console.log(req.body,"saaaa")
  try {
    const {
      AppName,
      FatherName,
      DOB,
      Gender,
      BloodGrp,
      Martialstatus,
      MarriageDate,
      Religion,
      CasteId,
      Nativity,
      ResAddress1,
      ResCountryId,
      ResStateId,
      ResDistrictId,
      ResTalukId,
      ResCityId,
      ResPincode,
      ResPhoneNo,
      PerAddress1,
      PerCountryId,
      PerStateId,
      PerDistrictId,
      PerTalukId,
      PerCityId,
      PerPincode,
      PerPhoneNo,
      LandMark,
      EmailId,
      PANNo,
      AadharNo,
      PassportNo,
    } = req.body;
    const AppId = req.headers.authorization.split(" ")[1];

    if (!AppId) {
      return res
        .status(404)
        .json({ success: false, message: "AppId not found in session" });
    }

    const query = `
    UPDATE ApplicationForm
    SET AppName = @AppName,
    FatherName = @FatherName,
    DOB = @DOB,
    Gender = @Gender,
    BloodGrp = @BloodGrp,
    Martialstatus = @Martialstatus,
    MarriageDate = @MarriageDate,
    Religion = @Religion,
    CasteId = @CasteId,
    Nativity = @Nativity,
    ResAddress1 = @ResAddress1,
    ResCountryId = @ResCountryId,
    ResStateId = @ResStateId,
    ResDistrictId = @ResDistrictId,
    ResTalukId = @ResTalukId,
    ResPincode = @ResPincode,
    ResCityId = @ResCityId,
    ResPhoneNo = @ResPhoneNo,
    PerAddress1 = @PerAddress1,
    PerCountryId = @PerCountryId,
    PerStateId = @PerStateId,
    PerDistrictId = @PerDistrictId,
    PerTalukId = @PerTalukId,
    PerCityId = @PerCityId,
    PerPincode = @PerPincode,
    PerPhoneNo = @PerPhoneNo,
    EmailId = @EmailId,
    PANNo = @PANNo,
    LandMark = @LandMark,
    AadharNo = @AadharNo,
    PassportNo=@PassportNo
    WHERE AppId = @AppId;
    `;

    const request = pool.request();

    request.input("AppName", AppName);
    request.input("FatherName", FatherName);
    request.input("DOB", DOB);
    request.input("Gender", Gender);
    request.input("BloodGrp", BloodGrp);
    request.input("Martialstatus", Martialstatus);
    request.input("MarriageDate", MarriageDate);
    request.input("Religion", Religion);
    request.input("CasteId", CasteId);
    request.input("Nativity", Nativity);
    request.input("ResAddress1", ResAddress1);
    request.input("ResCountryId", ResCountryId);
    request.input("ResTalukId", ResTalukId);
    request.input("ResStateId", ResStateId);
    request.input("ResDistrictId", ResDistrictId);
    request.input("ResPincode", ResPincode);
    request.input("ResCityId", ResCityId);
    request.input("ResPhoneNo", ResPhoneNo);
    request.input("PerAddress1", PerAddress1);
    request.input("PerCountryId", PerCountryId);
    request.input("PerStateId", PerStateId);
    request.input("PerDistrictId", PerDistrictId);
    request.input("PerTalukId", PerTalukId);
    request.input("PerCityId", PerCityId);
    request.input("PerPincode", PerPincode);
    request.input("PerPhoneNo", PerPhoneNo);
    request.input("EmailId", EmailId);
    request.input("PANNo", PANNo);
    request.input("LandMark", LandMark);
    request.input("AadharNo", AadharNo);
    request.input("PassportNo",PassportNo)
    request.input("AppId", AppId);

    const result = await request.query(query);

    // Check if any rows were affected
    if (result.rowsAffected[0] > 0) {
      console.log("Personal Details updated successfully");
      res.status(200).json({
        success: true,
        message: "Personal Details updated successfully",
      });
    } else {
      console.error("Failed to update work experience");
      res
        .status(404)
        .json({ success: false, message: "Failed to update Personal Details" });
    }
  } catch (error) {
    console.error("Error updating Personal Details:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const getPresentAllCountries = (req, res) => {
  // Logic to fetch all countries from the database
  pool
    .request()
    .query("SELECT * FROM Countries_master")
    .then((result) => {
      res.json(result.recordset);
    })
    .catch((err) => {
      console.error("Error fetching countries:", err);
      res.status(500).json({ error: "Error fetching countries" });
    });
};

// controllers/stateController.js
export const getPresentStatesByCountryId = (req, res) => {
  // Logic to fetch states by country ID from the database
  const { countryId } = req.params;
  pool
    .request()
    .input("countryId", sql.Int, countryId)
    .query("SELECT * FROM States_master WHERE country_gid = @countryId")
    .then((result) => {
      res.json(result.recordset);
    })
    .catch((err) => {
      console.error("Error fetching states:", err);
      res.status(500).json({ error: "Error fetching states" });
    });
};
// const verifyAndDecodeToken = (token) => {
//   try {
//     // Decode the token
//     const decodedToken = jwt.verify(token, JWT_KEY);
//     const { AppId } = decodedToken;
//     return { AppId };
//   } catch (error) {
//     throw new Error('Token verification failed'); // Throw an error if token verification fails
//   }
// };


export const  getPersonalDetails = async (req, res) => {
 console.log(req.headers.authorization.split(' ')[1],"lalalalala")
  try {
    const AppId = req.headers.authorization.split(' ')[1];
    
    if (!AppId) {
      return res.status(404).json({ success: false, message: "AppId not found in session" });
    }

    const query = `
      SELECT APP.*, 
             CON.country_name, 
             STT.state_name, 
             DIS.Districtname, 
             TAL.TalukName, 
             CIY.city_name 
      FROM ApplicationForm APP
      INNER JOIN Countries_master CON ON CON.country_gid = APP.ResCountryId
      INNER JOIN States_master STT ON STT.state_gid = APP.ResStateId
      INNER JOIN District DIS ON DIS.DistrictId = APP.ResDistrictId
      INNER JOIN Taluk TAL ON TAL.TalukId = APP.ResTalukId
      INNER JOIN Cities_master CIY ON CIY.city_gid = APP.ResCityId
      WHERE APP.AppId = @AppId
    `;
   
 
    const request = pool.request();
    request.input("AppId", AppId);

    const result = await request.query(query);
    console.log(result,"shahaha")
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

// Check if authorization header exists
//     if (!req.headers.authorization) {
//       return res.status(401).json({ success: false, message: "Unauthorized" });
//     }

//     // Split authorization header and extract token
//     const token = req.headers.authorization.split(" ")[1];
//     if (!token) {
//       return res.status(401).json({ success: false, message: "Unauthorized" });
//     }

//     let AppId;
//     try {
//       // Verify and decode the token to get the AppId
//       const decodedToken = verifyAndDecodeToken(token);
//       AppId = decodedToken.AppId;
//     } catch (error) {
//       console.error("Error verifying token:", error.message);
//       return res.status(401).json({ success: false, message: "Token verification failed" });
//     }

//     // Query to fetch user details using the AppId
//     const query = `
//       SELECT * FROM ApplicationForm WHERE AppId = @AppId;
//     `;

//     const request = pool.request();

//     request.input("AppId", AppId);

//     const result = await request.query(query);

//     if (result.recordset.length > 0) {
//       const userDetails = result.recordset[0];
//       res.status(200).json({ success: true, data: userDetails });
//     } else {
//       res.status(404).json({ success: false, message: "User details not found" });
//     }
//   } catch (error) {
//     console.error("Error fetching user details:", error.message);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };
