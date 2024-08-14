import express from "express";
import { getProfileDetails, PhotoController } from "../../Controller/admin/ProfileController.js";
import upload from "../../Middleware/IdPhotoMulter.js";


const router = express.Router();

router.get("/profile", getProfileDetails);
router.get('/pic/:EmployeeId', PhotoController);


// export the router
export default router;
