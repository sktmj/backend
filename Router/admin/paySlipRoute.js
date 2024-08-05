import express from "express";
import { PayslipController } from "../../Controller/admin/payShlipController.js";


const router = express.Router();

router.get("/payslip/:EmployeeId",PayslipController )


// export the router
export default router;
    