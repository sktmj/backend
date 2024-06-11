
import express from "express"

import { uploadProfilePic,uploadMobilePic, uploadResume } from "../../Controller/Uploads.js";
import multipleUpload from "../../Middleware/Multer.js";


const router = express.Router();


router.post("/profilepic", multipleUpload.single('Pic'), uploadProfilePic);
router.post("/mobilepic", multipleUpload.single('MobilePic'), uploadMobilePic);
router.post("/resume", multipleUpload.single('ResumeFileName'), uploadResume);
export default router;