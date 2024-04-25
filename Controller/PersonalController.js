// Your controller.js
import sql from "mssql";
import pool from "../config/db.js";
import { config } from "../config/db.js";

import jwt from "jsonwebtoken";
import { getType } from './../helper/PersonalHelper.js';
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
  try {
    const token = req.headers.authorization.split(' ')[1]; // Extract token from Authorization header
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify and decode JWT token

    if (!decodedToken) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { userName } = decodedToken;
    const queryParams = req.body;

    let setStatements = "";
    const inputParams = [];

    for (const [key, value] of Object.entries(queryParams)) {
      // Exclude fields that are not part of the ApplicationForm table
      if (value !== undefined && isValidField(key)) { 
        setStatements += `${key} = @${key}, `;
        inputParams.push({ name: key, type: getType(value), value });
      }
    }

    if (setStatements === "") {
      return res.status(400).json({ success: false, message: "No fields provided for update" });
    }

    setStatements = setStatements.slice(0, -2);

    const query = `
      UPDATE ApplicationForm
      SET
        ${setStatements}
      WHERE UserName = @UserName
    `;

    const request = pool.request();
    inputParams.forEach((param) =>
      request.input(param.name, param.type, param.value)
    );
    request.input("UserName", sql.NVarChar, userName);

    const result = await request.query(query);

    if (result.rowsAffected[0] > 0) {
      res.status(200).json({
        success: true,
        message: "Personal details updated successfully",
      });
    } else {
      res.status(404).json({ success: false, message: "Application form not found" });
    }
  } catch (error) {
    console.error("Error updating ApplicationForm:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Helper function to check if a field is valid in ApplicationForm
const isValidField = (fieldName) => {
  const validFields = [
    // List all valid fields from the ApplicationForm table here
    "AppName",
    "FatherName",
    "DOB",
    "Gender",
    "BloodGrp",
    "Martialstatus",
    "MarriageDate",
    "Religion",
    "CasteId",
    "Nativity",
    "ResAddress1",
    "ResCountryId",
    "ResStateId",
    "ResDistrictId",
    "ResTalukId",
    "ResCityId",
    "ResPincode",
    "ResPhoneNo",
    "PerAddress1",
    "PerCountryId",
    "PerStateId",
    "PerDistrictId",
    "PerTalukId",
    "PerCityId",
    "PerPincode",
    "PerPhoneNo",
    "LandMark",
    "EmailId",
    "PANNO",
    "AadharNo"
  ];
  return validFields.includes(fieldName);
};
