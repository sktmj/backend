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
} from "../../Controller/PersonalController.js";


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


export default router;
