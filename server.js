import express from "express";
import employeeRoutes from "./Router/employe/authRoute.js";
import personalRoutes from "./Router/employe/personalRoutes.js"
import QulificationRoutes from "./Router/employe/QulificationRoute.js"
import morgan from "morgan";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
const app = express();
import * as dotenv from 'dotenv';

app.use(
  session({
    secret: "your_secret_key_here", 
    resave: false, 
    saveUninitialized: true, 
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // Session expiration time (e.g., 1 day)
    },
  })
);
//middleware
app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cors());
app.use(cookieParser());
dotenv.config();
//Routes
app.use("/api/v1/auth", employeeRoutes);
app.use("/api/v1/prsl",personalRoutes)
app.use("/api/v1/Qf",QulificationRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
