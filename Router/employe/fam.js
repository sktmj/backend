import express from "express"
import { FamilyDetails, LanguaguesController, getlanguages } from "../../Controller/FamilyController.js";
const router = express.Router();


router.get("/getlan",getlanguages)
router.post("/famroute", FamilyDetails);
router.post("/lanroute",LanguaguesController)

export default router;