import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";



export const hashPassword = async (password) => {
  try {
    const saltRounds = 50;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

 export const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw error;
  }
};

export const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error("Error verifying token:", error.message);
    res.status(401).json({ error: "Invalid token" });
  }
};


// server : 192.168.50.38\\DAIVELHO
// Database : DAIVELP2P

// Username : sa
// Password : Admin@1234


// export const config = {
//   server: "192.168.50.30",
//   database: "SKTPayroll",
//   user: "sa",
//   password: "ktm@werty123",
//   options: {
//     encrypt: false,
//   },
// };