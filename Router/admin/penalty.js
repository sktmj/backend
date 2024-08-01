import express from "express";
import { DailyController, SummeryController,OthersController } from "../../Controller/admin/penaltyController.js";



const router = express.Router();

// Define the route for the DailyController
router.get("/penalty/:EmployeeId", DailyController);
router.get("/summery/:EmployeeId",SummeryController)
router.get("/others/:EmployeeId",OthersController)

// Export the router
export default router;
