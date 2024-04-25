// authMiddleware.js
export const  authenticateUser  = (req, res, next) => {
  if (!req.session.userName) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  next();
};
