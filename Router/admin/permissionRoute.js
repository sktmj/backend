import express from "express";
import { PermissionController } from "../../Controller/admin/permisssion.js";


const router = express.Router();

router.get("/permission/:EmployeeId",PermissionController);

// export the router
export default router;
