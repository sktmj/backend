import express from "express";

import {
  insertAppQualification,
  getCourses,
  insertAppCourse,
  getQulificationDetails,
  getCourseDetails,
  updateAppQualification,
  updateAppCourse,
} from "../../Controller/AcademicDetails.js";

const router = express.Router();

router.get("/qualification", getCourses);
router.post("/InsertQlCT", insertAppQualification);
router.post("/courses", insertAppCourse);
router.get("/getQlf", getQulificationDetails);
router.get("/getCourse", getCourseDetails)
router.put("/updateAppQualification", updateAppQualification);
router.put("/updateAppCourse",updateAppCourse)
export default router;
