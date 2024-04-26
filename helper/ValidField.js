// validation.js

// List all valid fields from the ApplicationForm table here
// Ensure that "ResCountryId", "ResStateId", etc., are included
const validFields = [
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
  
  export const isValidField = (fieldName) => {
    return validFields.includes(fieldName);
  };
  