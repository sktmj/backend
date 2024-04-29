import express from "express";
import { InsertExperience, getDesignation,UpdateWorkExperience,uploadCarLicenseDoc} from '../../Controller/WorkExperience.js';
import { Upload } from './../../Middleware/Multer.js';

const router = express.Router();


router.get("/designation",getDesignation)
 router.post("/experience", InsertExperience)
 router.post("/TotalExperience",UpdateWorkExperience)
 router.post("/carupload", Upload.single('CarLicenseDoc'), uploadCarLicenseDoc);

export default router;