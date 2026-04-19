import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const isAuthenticated = async (req, res, next) => {
  const token = req.cookies.token;


  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);


    const user = await User.findById(decodedToken.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
