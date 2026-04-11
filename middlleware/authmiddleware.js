import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).send("No token provided");
  }

  const token = header.split(" ")[1];

  if (!token) {
    return res.status(401).send("Invalid token");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).send("User not found");
    }

    if (!user.isActive) {
      return res.status(403).send("Account is deactivated");
    }

    req.user = user;

    next();

  } catch (err) {
    return res.status(401).send("Token is not valid");
  }
};

export const checkRole = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).send("Access denied");
    }

    next();
  };
};