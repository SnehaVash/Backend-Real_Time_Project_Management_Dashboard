import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import logger from "../utils/logger.js";

export async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters!" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format!" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const allowedRoles = ["admin","manager", "member"];

    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'member'
    });

  
    logger.info(`New user registered: ${email}`);

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {

      logger.warn(`Failed login attempt for email: ${email}`);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isActive) {
   
      logger.warn(`Login attempt on deactivated account: ${email}`);
      return res.status(403).json({ message: "Account is deactivated!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
  
      logger.warn(`Wrong password attempt for email: ${email}`);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    logger.info(`User logged in: ${email}`);

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    next(error);
  }
}