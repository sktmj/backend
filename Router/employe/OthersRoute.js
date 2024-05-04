import express from "express"
import { UpdateOthers, getLocation } from "../../Controller/OtherDetails.js";

const router = express.Router();

router.post("/others", UpdateOthers)
router.get("/location",getLocation)

export default router;