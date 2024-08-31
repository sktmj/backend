// Controller: employeController.js

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { sendSMS } from "../helper/Sms.js";
import { checkIfUserExists } from "../helper/PersonalHelper.js";

import * as dotenv from "dotenv";
import { pool } from "../config/db.js";

dotenv.config();

const JWT_KEY = "your_secret_key_here"; // Corrected JWT_KEY definition

const insertDataIntoDB = async (MobileNo, AppName, Passwrd, UserName) => {
  try {
    const hashedPassword = await bcrypt.hash(Passwrd, 12);
    const truncatedPassword = hashedPassword.substring(0, 12);

    const query = `INSERT INTO ApplicationForm (MobileNo, AppName, Passwrd, UserName) VALUES (@MobileNo, @AppName, @Passwrd, @UserName)`;

    const request = pool
      .request()
      .input("MobileNo", MobileNo)
      .input("AppName", AppName)
      .input("Passwrd", truncatedPassword)
      .input("UserName", UserName);

    await request.query(query);
  } catch (error) {
    console.error("Error inserting data into DB:", error.message);
    throw error;
  }
};
// Temporary storage for OTPs
const otpStorage = {};

// Function to generate a unique AppID
const generateUniqueAppID = () => {
  return Math.random().toString(36).substr(2, 10);
};

// Function to generate OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Function to generate JWT token
const generateJWT = (userName, AppId) => {
  return jwt.sign({ userName, AppId }, JWT_KEY, {
    expiresIn: "10d", // Set expiration time to 10 days
  });
};
// Route controller for signing up
export const signUp = async (req, res) => {
  try {
    const { MobileNo, AppName } = req.body;
    const OTP = generateOTP();

    // Store the OTP in memory
    otpStorage[MobileNo] = OTP;

    // Send OTP via SMS
    const smsResult = await sendSMS(MobileNo, OTP);

    if (smsResult === "OTP Sent") {
      // Generate a unique AppID for this application
      const AppID = generateUniqueAppID();

      // Generate JWT token with AppID
      const token = generateJWT(AppName, AppID);

      res.json({ token, msg: "OTP generated successfully" });
    } else {
      console.error("Error sending OTP via SMS:", smsResult);
      res.status(500).json({ error: "Failed to send OTP via SMS" });
    }
  } catch (error) {
    console.error("Error signing up:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { MobileNo, EnteredOTP, Passwrd, AppName } = req.body; // Include AppName in destructuring

    // Retrieve the OTP from memory
    const storedOTP = otpStorage[MobileNo];

    if (!storedOTP || EnteredOTP !== storedOTP) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Delete the OTP from memory after verification
    delete otpStorage[MobileNo];

    // Check if the user already exists
    const userExists = await checkIfUserExists(MobileNo);
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Insert user data into the database
    await insertDataIntoDB(MobileNo, AppName, Passwrd, MobileNo);

    // Assuming AppID is unique for each application
    const AppID = generateUniqueAppID();

    // Generate JWT token with AppID
    const token = generateJWT(AppName, AppID);

    res.json({ token, msg: "Signup successful" });
  } catch (error) {
    console.error("Error verifying OTP and completing signup:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const verifyToken = (req, res, next) => {
  try {
    // Retrieve the token from the request headers
    const token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Invalid token format" });
    }

    // Extract the token from the "Bearer " string
    const tokenWithoutBearer = token.split(" ")[1];

    // Verify and decode the token
    const decodedToken = jwt.verify(tokenWithoutBearer,JWT_KEY);

    // Check if the decoded token contains the required fields
    if (!decodedToken.userName || !decodedToken.AppId) {
      throw new Error("Invalid token contents");
    }

    // Set decoded user object to req.user
    req.user = decodedToken;

    // Move to the next middleware
    next();
  } catch (error) {
    console.error("Error verifying token:", error.message);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export const login = async (req, res) => {
  try {
    const { UserName } = req.body;

    // Query the database to retrieve user data including AppId
    const query = `
      SELECT UserName, AppId
      FROM ApplicationForm
      WHERE UserName = @UserName
    `;

    const request = pool.request();
    request.input("UserName", UserName);
    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.recordset[0];
    const { AppId } = user; // Extract AppId from user data

    // Log UserName and AppId to the console
    console.log("UserName:", user.UserName);
    console.log("AppId:", AppId);

    // Generate JWT token
    const token = generateJWT(UserName, AppId);

    res.status(200).json({ message: "Login successful", token, AppId });
  } catch (error) {
    console.error("Error logging in:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};