import express from "express";
import { PunchController } from "../../Controller/admin/punchController.js";

const router = express.Router();

router.get("/punch/:UserId", PunchController);


// export the router
export default router;
