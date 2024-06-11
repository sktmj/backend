import express from "express";
import employeeRoutes from "./Router/employe/authRoute.js";
import personalRoutes from "./Router/employe/personalRoutes.js";
import QulificationRoutes from "./Router/employe/QulificationRoute.js";
import ExperienceRoutes from "./Router/employe/ExperienceRoutes.js";
import familyRoute from "./Router/employe/FamilyRoute.js"
import OtherRoutes from "./Router/employe/OthersRoute.js";
import uploadRoutes from "./Router/employe/UploadeRoutes.js";
import morgan from "morgan";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import path from "path";
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

// Middleware to serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", employeeRoutes);
app.use("/api/v1/prsl", personalRoutes);
app.use("/api/v1/Qlf", QulificationRoutes);
app.use("/api/v1/expc", ExperienceRoutes);
app.use("/api/v1/fam",familyRoute);
app.use("/api/v1/other", OtherRoutes);
app.use("/api/v1/uploads", uploadRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
