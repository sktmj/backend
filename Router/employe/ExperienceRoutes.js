import express from "express";
import { InsertExperience, getDesignation,UpdateWorkExperience,uploadCarLicenseDoc} from '../../Controller/WorkExperience.js';
import multipleUpload from './../../Middleware/Multer.js';

const router = express.Router();


router.get("/designation",getDesignation)
 router.post("/experience", InsertExperience)
 router.post("/TotalExperience",UpdateWorkExperience)
 router.post('/upload', multipleUpload.single('CarLicenseDoc'), uploadCarLicenseDoc);

export default router;