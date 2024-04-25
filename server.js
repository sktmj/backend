import express from "express";
import employeeRoutes from "./Router/employe/authRoute.js";
import personalRotues from "./Router/employe/personalRoutes.js"
import morgan from "morgan";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
const app = express();


app.use(
  session({
    secret: "your_secret_key_here", // Secret key used for session encryption
    resave: false, // Avoids saving unchanged sessions
    saveUninitialized: true, // Saves new sessions even if they haven't been modified
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
//Routes
app.use("/api/v1/auth", employeeRoutes);
app.use("/api/v1/prsl",personalRotues)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
