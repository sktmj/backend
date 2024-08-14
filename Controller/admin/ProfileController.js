import {pool} from "../../config/db.js";



export const PhotoController =async (req, res) => {

  // Assuming you don't need to fetch from the database as per your requirement
  res.json({ success: true, message: 'Image fetched successfully' });
};

export const getProfileDetails = async (req, res) => {
  console.log(req.headers.authorization.split(" ")[1], "hiiiiiii");
  try {
    const EmployeeId = req.headers.authorization.split(" ")[1];

    if (!EmployeeId) {
      return res
        .status(404)
        .json({ success: false, message: "EmployeeId not found in session" });
    }

    const query = `
     select EmployeeId,BiometricCode,Name,DSG.DesignationName,DateofBirth,DateofJoining,FatherName,MobileNo,alternatemobileno,ISNULL(SpouseName,'')AS SpouseName,ISNULL(spousemobileno,'') AS SpouseMobileNo,ISNULL(mothername,'') AS MotherName,ISNULL(mothermobileno,'')AS MotherMobileNo
from EmployeeMaster EMP

INNER JOIN DesignationMaster DSG ON DSG.DesignationId= EMP.DesignationId
      WHERE EMP.EmployeeId = @EmployeeId
    `;

    const request = pool.request();
    request.input("EmployeeId", EmployeeId);

    const result = await request.query(query);

    if (result.recordset.length > 0) {
      console.log("Profile retrieved successfully");
      res.status(200).json({ success: true, data: result.recordset });
    } else {
      console.error("No Profile found for the given EmployeeId");
      res
        .status(404)
        .json({ success: false, message: "No Qualification  found" });
    }
  } catch (error) {
    console.error("Error fetching Profile:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
