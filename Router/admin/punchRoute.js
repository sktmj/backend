import express from "express";
import { PunchController } from "../../Controller/admin/punchController.js";

const router = express.Router();

router.get("/punch/:employeeIdemployeeIdemployeeIdemployeeId", PunchController);


// export the router
export default router;
