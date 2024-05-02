import express from "express"
import { UpdateOthers } from "../../Controller/OtherDetails.js";

const router = express.Router();

router.post("/others", UpdateOthers)

export default router;