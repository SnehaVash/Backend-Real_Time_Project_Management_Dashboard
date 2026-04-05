import fs from "fs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const filePath = "user.json";

export function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name) {
      return res.status(400).send("Name is required");
    }

    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    let users = [];

    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      users = JSON.parse(data);
    }

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).send("User already exists");
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = {
      id: Date.now(),
      name,
      email,
      password: hashedPassword
    };

    users.push(newUser);

    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

    return res.status(201).send("User registered successfully");

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}


export function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    let users = [];

    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      users = JSON.parse(data);
    }

    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(400).send("User not found");
    }

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(400).send("Wrong password");
    }

    const token = jwt.sign(
      { id: user.id },
      "secretkey"
    );

    return res.json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}