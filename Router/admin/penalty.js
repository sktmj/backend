import express from "express";
import { DailyController } from "../../Controller/admin/penaltyController.js";

const router = express.Router();

// Define the route for the DailyController
router.get("/penalty/:EmployeeId", DailyController);

// Export the router
export default router;
