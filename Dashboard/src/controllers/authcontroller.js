import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name) {
      return res.status(400).send("Name is required");
    }

    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    if (password.length < 6) {
        return res.status(400).send("Password must be at least 6 characters!");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        return res.status(400).send("Invalid email format!");
    }
    
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).send("User already exists");
    }

    const allowedRoles = ["manager", "member"];

    if (role && !allowedRoles.includes(role)){
      return res.status(400).send("Invalid role!");
    }

  
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
    }
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}


export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send("User not found");
    }

  
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send("Wrong password");
    }

    if (!user.isActive) {
    return res.status(403).send("Account is deactivated!");
    }

    
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({ 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    }
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}