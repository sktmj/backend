// import required modules
import express from "express";
import {
  login,
  signUp,
  verifyOTP,
  verifyToken,
} from "../../Controller/employeController.js";

// create an Express router
const router = express.Router();

// define routes
router.post("/signUp", signUp);
router.post("/verifyOTP", verifyOTP);
router.post("/login", login);
// Example of protecting a route
router.get("/protectedRoute", verifyToken, (req, res) => {
 
  res.json({ msg: "Protected route accessed", user: req.user });
});


// export the router
export default router;
