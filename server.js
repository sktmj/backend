import express from "express";
import employeeRoutes from "./Router/employe/authRoute.js";
import personalRoutes from "./Router/employe/personalRoutes.js";
import QulificationRoutes from "./Router/employe/QulificationRoute.js";
import ExperienceRoutes from "./Router/employe/ExperienceRoutes.js";
import familyRoute from "./Router/employe/FamilyRoute.js"
import OtherRoutes from "./Router/employe/OthersRoute.js";
import uploadRoutes from "./Router/employe/UploadeRoutes.js";

import adminAuth from "./Router/admin/authRoute.js"
import adminOutpass from "./Router/admin/OutpassRoute.js"
import adminLeave from "./Router/admin/leaveRoute.js"
import adminProfile from "./Router/admin/profile.js"
import adminPenalty from "./Router/admin/penalty.js"
import adminMuster from "./Router/admin/musterRoute.js"
import adminPermission from "./Router/admin/permissionRoute.js"
import adminPunch from "./Router/admin/punchRoute.js"
import adminPaySlip from "./Router/admin/paySlipRoute.js"
import adminBank from "./Router/admin/bankRoute.js"
import adminHome from "./Router/admin/homeRoute.js"
import morgan from "morgan";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  session({
    name: "sessionId",
    secret: "your_secret_key_here",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // Session expiration time (e.g., 1 day)
      secure: false, // Set to true if your app is served over HTTPS
      sameSite: "strict", // Change to "lax" or "none" based on your requirements
    },
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors({
  origin: 'http://hrm.daivel.in', // Replace with your React Native app's domain or use '*' to allow all origins (not recommended for production)
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));
app.use(cookieParser());




// Routes
app.use("/api/v1/auth", employeeRoutes);
app.use("/api/v1/prsl", personalRoutes);
app.use("/api/v1/Qlf", QulificationRoutes);
app.use("/api/v1/expc", ExperienceRoutes);
app.use("/api/v1/fam",familyRoute);
app.use("/api/v1/other", OtherRoutes);
app.use("/api/v1/uploads", uploadRoutes);

//admin routes
app.use("/api/v2/auth",adminAuth);
app.use("/api/v2/home",adminOutpass)
app.use("/api/v2/lve",adminLeave)
app.use("/api/v2/pro",adminProfile)
app.use("/api/v2/pen",adminPenalty)
app.use("/api/v2/must",adminMuster)
app.use("/api/v2/per",adminPermission)
app.use("/api/v2/pun",adminPunch)
app.use("/api/v2/pay",adminPaySlip)
app.use("/api/v2/info", adminBank);
app.use("/api/v2/hm",adminHome)



app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f9;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        .container {
          text-align: center;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          padding: 20px;
          max-width: 600px;
          width: 100%;
        }
        h1 {
          color: #333;
          font-size: 2em;
          margin-bottom: 10px;
        }
        p {
          color: #666;
          font-size: 1.2em;
          margin-top: 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to Daivel Universal Software Solutions</h1>
        <p>It's an Application Server created by Ajay Banu</p>
      </div>
    </body>
    </html>
  `);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});