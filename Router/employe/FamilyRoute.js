
import express from 'express';
import { FamilyDetails,getFamilyDetails,getLanguageDetails,getlanguages,LanguaguesController, UpdateFamilyDetails, UpdateLanguagesDetails } from '../../Controller/FamilyController.js';

const router = express.Router();

router.get("/languages",getlanguages)
router.post("/family", FamilyDetails);
router.post("/postLng",LanguaguesController)
router.get("/getFam", getFamilyDetails)
router.put("/updatefam",UpdateFamilyDetails)
router.get("/getLan",getLanguageDetails)
router.put("/updateLan",UpdateLanguagesDetails)

export default router