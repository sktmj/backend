import {pool} from "../../config/db.js";
// Controller/admin/ProfileController.js
import path from 'path';
import fs from 'fs';

export const PhotoController = (req, res) => {
  const { EmployeeId } = req.params;

  // Construct the file path
  const filePath = path.join('/mnt/shared_images/IDCardPath', `${EmployeeId}.jpg`);

  // Check if file exists before sending
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('File does not exist:', filePath);
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    // Serve the image
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error serving file:', err);
        res.status(500).json({ success: false, message: 'Error serving image' });
      } else {
        console.log('Image served successfully');
      }
    });
  });
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
