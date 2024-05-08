
import express from "express";

import { 

    insertAppQualification,
    getCourses, 
    insertAppCourse,
   
} 
from "../../Controller/AcademicDetails.js";
import { verifyToken } from "../../Controller/employeController.js";


const router = express.Router();




router.get("/qualification",getCourses)
router.post("/InsertQlCT",insertAppQualification)
router.post("/courses" ,insertAppCourse )



export default router;