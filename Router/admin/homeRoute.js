import express from "express";
import { HomeController } from "../../Controller/admin/homeController";



const router = express.Router();

router.get("/home/:EmployeeId", HomeController);



// export the router
export default router;
  