
import express from "express"

import { uploadProfilePic } from "../../Controller/Uploads.js";
import multipleUpload from "../../Middleware/Multer.js";


const router = express.Router();


router.post("/profilepic", multipleUpload.single('Pic'), uploadProfilePic);
export default router;