import express from "express";
import { musterController } from "../../Controller/admin/musterController.js";

const router = express.Router();

router.get("/muster/:EmployeeId",musterController);

// export the router
export default router;
