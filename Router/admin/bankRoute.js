import express from "express";
import { BankController } from "../../Controller/admin/bankController.js";


const router = express.Router();

router.get("/bank/:EmployeeId", BankController);



// export the router
export default router;
  