
import express from "express";

import { 
    Qulification,
    getCourses 
} 
from "../../Controller/AcademicDetails.js";
import { verifyToken } from "../../Controller/employeController.js";
const router = express.Router();




router.get("/qualification",getCourses)
router.post("/InsertQlCT",verifyToken, Qulification)


export default router;