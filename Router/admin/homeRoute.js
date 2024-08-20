import express from "express";
import { HomeController } from "../../Controller/admin/homeController.js";



const router = express.Router();

router.get("/home/:EmployeeId", HomeController);



// export the router
export default router;
  