import express from "express";
import {
  getAllCountries,
  getStatesByCountryId,
  getDistrictsByStateId,
  getTaluksByDistrictId,
  getCitiesByTalukId,
  personlController,
  getReligionController,
  getCastesByReligion,
  getPresentAllCountries,
  getPresentStatesByCountryId,
  getPersonalDetails,
} from "../../Controller/PersonalController.js";
import { UpdateDeclaration, getDeclarationDetails } from "../../Controller/Declaration.js";


const router = express.Router();

// Route to get castes by religion ID
router.get("/getReligion", getReligionController);
router.get("/caste/:religion_gid", getCastesByReligion);
router.get("/getAllCountries", getAllCountries);
router.get("/states/:countryId", getStatesByCountryId);
router.get("/districts/:stateId", getDistrictsByStateId);
router.get('/taluk/:districtId', getTaluksByDistrictId);
router.get('/city/:talukId', getCitiesByTalukId);
router.post('/updatePersonalDetails', personlController);
router.get("/presentCountries",getPresentAllCountries)
router.get("/PresentState/:countryId",getPresentStatesByCountryId)
router.get("/getPrsl",getPersonalDetails)

///this two is decalration controller .....
router.post("/declaration", UpdateDeclaration);
router.get("/getDeclaration",getDeclarationDetails)

export default router;
