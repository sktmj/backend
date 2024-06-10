
import express from "express"

import { uploadProfilePic,uploadMobilePic } from "../../Controller/Uploads.js";
import multipleUpload from "../../Middleware/Multer.js";


const router = express.Router();


router.post("/profilepic", multipleUpload.single('Pic'), uploadProfilePic);
router.post("/mobilepic", multipleUpload.single('MobilePic'), uploadMobilePic);
export default router;