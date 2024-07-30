import express from "express";
import { getProfileDetails } from "../../Controller/admin/ProfileController.js";


const router = express.Router();

router.get("/profile", getProfileDetails);


// export the router
export default router;
