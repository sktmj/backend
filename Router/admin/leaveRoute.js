import express from "express";
import { employeIdcontroller, getLeaveController, getLeaveReportController, insertLeaveController, OrganisationController, RequestController } from "../../Controller/admin/leaveController.js";

const router = express.Router();

router.get("/employeId/:EmployeeId", employeIdcontroller)
router.get("/organistionId/:EmployeeId", OrganisationController)
router.get("/request/:FactoryId",RequestController)
router.get("/getleave",getLeaveController)
router.post("/inserLeave",insertLeaveController)
router.get("/allLeave/:EmployeeId",getLeaveReportController)


// export the router
export default router;
