import pool from "../config/db.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const uploadProfilePic = async (req, res) => {
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
    const query = `UPDATE ApplicationForm SET Pic = @Pic WHERE AppId = @AppId`;
    const request = pool.request();
    request.input("Pic", fileName);
    request.input("AppId", AppId);
    
    const result = await request.query(query);

    // Check if any rows were affected
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      console.log("Profile picture updated successfully");
      res.status(200).json({
        success: true,
        message: "Profile picture updated successfully",
      });
    } else {
      console.error("Failed to update profile picture");
      res.status(404).json({ success: false, message: "Failed to update profile picture" });
    }
  } catch (error) {
    console.error("Error updating profile picture:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



export const uploadMobilePic = async (req, res) => {
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
    const query = `UPDATE ApplicationForm SET MobilePic = @MobilePic WHERE AppId = @AppId`;
    const request = pool.request();
    request.input("MobilePic", fileName);
    request.input("AppId", AppId);
    
    const result = await request.query(query);

    // Check if any rows were affected
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      console.log("MobilePic updated successfully");
      res.status(200).json({
        success: true,
        message: "MobilePic updated successfully",
      });
    } else {
      console.error("Failed to update MobilePic");
      res.status(404).json({ success: false, message: "Failed to update MobilePic" });
    }
  } catch (error) {
    console.error("Error updating MobilePic:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
