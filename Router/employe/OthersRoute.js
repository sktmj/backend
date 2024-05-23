import express from "express"
import { UpdateOthers, getLocation, getOtherDetails } from "../../Controller/OtherDetails.js";

const router = express.Router();

router.post("/others", UpdateOthers)
router.get("/location",getLocation)
router.get("/getOthers",getOtherDetails)

export default router;