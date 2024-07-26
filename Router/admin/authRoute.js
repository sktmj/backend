import express from "express";
import { Adminlogin } from "../../Controller/admin/authController.js";
const router = express.Router();

router.post("/Admin", Adminlogin);

// export the router
export default router;
