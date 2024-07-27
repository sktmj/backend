import express from "express";
import { employeIdcontroller, getCalander, insertOutpassController, OrganisationController } from "../../Controller/admin/OutpassController.js";

const router = express.Router();

router.get("/calander", getCalander);
router.get("/employeId/:EmployeeId", employeIdcontroller)
router.get("/organistionId/:EmployeeId", OrganisationController)
router.post("/outpass",insertOutpassController)

// export the router
export default router;
