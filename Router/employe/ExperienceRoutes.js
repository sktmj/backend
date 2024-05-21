import express from "express";
import {
  InsertExperience,
  getDesignation,
  UpdateWorkExperience,
  uploadCarLicenseDoc,
  getExperience,
  updateAppExperience,
  getExperienceDetails,
} from "../../Controller/WorkExperience.js";
import multipleUpload from "./../../Middleware/Multer.js";

const router = express.Router();

router.get("/designation", getDesignation);
router.post("/experience", InsertExperience);
router.post("/TotalExperience", UpdateWorkExperience);
router.post(
  "/upload",
  multipleUpload.single("CarLicenseDoc"),
  uploadCarLicenseDoc
);
router.get("/getExpc", getExperience);
router.put("/updateExpc", updateAppExperience);
router.get("/getExperience",getExperienceDetails)

export default router;
