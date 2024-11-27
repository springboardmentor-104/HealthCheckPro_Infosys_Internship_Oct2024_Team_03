import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/jwt.js";

export const isAdmin = async (req, res, next) => {
  try {
    const userId = req.headers.userid;
    const user = await User.findById(userId);

    if(!user) 
      return res.status(404).json({ error: "User not found!" });

    if (user && user.isAdmin) {
      req.user = user;
      next();
    } else {
      res.status(403).json({ message: "Access Denied!" });
    }
  } catch (error) {
    res.status(401).json({ message: "Not Authorized!" });
  }
};

export const authentiateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if(!token)
      return res.status(401).json({ message: "Access token required!" });

    jwt.verify(token, jwtSecret, async(err, user) => {
      if(err) 
        return res.status(403).json({ message: "Invalid token" });
      
      req.user = user;
      next();
    })
  } catch (error) {
    console.log(`Server: not authenticated`)
    res.status(401).json({ message: "Not Authorized!" });
  }
};
