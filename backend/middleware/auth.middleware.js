import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

export const isAuthenticated = async (req, res, next) => {
  const token = req.cookies.token;


  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.DIGITAL_SIGNATURE_KEY);


    const user = await User.findOne({ email: decodedToken.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; 
    next(); 
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
