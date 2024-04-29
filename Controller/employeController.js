// Controller: employeController.js

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../config/db.js";
import { sendSMS } from "../helper/Sms.js";
import { checkIfUserExists } from "../helper/PersonalHelper.js";

import * as dotenv from "dotenv";

dotenv.config();

const JWT_KEY = "jsjsjsjsjsj"

console.log(JWT_KEY , "vickyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");

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
const generateJWT = (AppID) => {
  return jwt.sign({ AppID }, JWT_KEY, {
    expiresIn: "10d",
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
      const token = generateJWT(AppID);

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
    const token = generateJWT(AppID);

    res.json({ token, msg: "Signup successful" });
  } catch (error) {
    console.error("Error verifying OTP and completing signup:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token)
    return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, JWT_KEY);
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error("Error verifying token:", error.message);
    res.status(401).json({ error: "Invalid token" });
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

    // Store AppId in the user session
    req.session.AppId = AppId;

    // Log UserName and AppId to the console
    console.log("UserName:", user.UserName);
    console.log("AppId:", AppId);

    // Generate JWT token
    const token = jwt.sign({ userName: user.UserName, AppId }, JWT_KEY);

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error logging in:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
