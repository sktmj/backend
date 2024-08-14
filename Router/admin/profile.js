import express from "express";
import { getProfileDetails, PhotoController } from "../../Controller/admin/ProfileController.js";
import upload from "../../Middleware/IdPhotoMulter.js";


const router = express.Router();

router.get("/profile", getProfileDetails);
router.post('pic/:EmployeeId', upload.single('IDCardImage'), PhotoController);


// export the router
export default router;
