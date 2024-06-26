import express from "express";
import {

  getDesignation,
  UpdateWorkExperience,
  updateAppExperience,
  getExperienceDetails,
  deleteExperience,
  uploadDrivingLic,
  addExperience,
  getExperience
} from "../../Controller/WorkExperience.js";
import multipleUpload from "../../Middleware/Multer.js";


 
const router = express.Router();

router.get("/designation", getDesignation);
router.post('/experienceee', addExperience);
router.put("/total", UpdateWorkExperience);
router.post("/licdoc", multipleUpload.single('CarLicenseDoc'), uploadDrivingLic);
router.get("/getExperience", getExperience);
router.put("/updateExpc", updateAppExperience);
router.get("/getExceDetails",getExperienceDetails)
router.delete("/deleteExperience/:ExpId",deleteExperience)

export default router;