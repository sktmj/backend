import express from "express";

import {
  insertAppQualification,
  getCourses,
  insertAppCourse,
  getQulificationDetails,
  getCourseDetails,
} from "../../Controller/AcademicDetails.js";

const router = express.Router();

router.get("/qualification", getCourses);
router.post("/InsertQlCT", insertAppQualification);
router.post("/courses", insertAppCourse);
router.get("/getQlf", getQulificationDetails);
router.get("/getCourse", getCourseDetails)

export default router;
