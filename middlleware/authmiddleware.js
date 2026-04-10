import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send("Token not provided");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send("Invalid token");
  }

  try {
    const decoded = jwt.verify(token, "secretkey");
    req.user = decoded; // store user info for later use
    next();
  } catch (err) {
    return res.status(401).send("Token is not valid");
  }
};