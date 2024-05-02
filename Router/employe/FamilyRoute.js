
import express from 'express';
import { FamilyDetails,getlanguages,LanguaguesController } from '../../Controller/FamilyController.js';

const router = express.Router();

router.get("/languages",getlanguages)
router.post("/family", FamilyDetails);
router.post("/postLng",LanguaguesController)

export default router