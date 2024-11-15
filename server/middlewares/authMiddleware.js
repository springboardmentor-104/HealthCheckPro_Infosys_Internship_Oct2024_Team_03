import User from "../models/User.js";

export const isAdmin = async (req, res, next) => {
  try {
    const userId = req.headers.userid;
    const user = await User.findById(userId);

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

export const isAuthenticated = async (req, res, next) => {
  try {
    const userId = req.headers.userid;
    console.log({userId});
    const user = await User.findById(userId);
    console.log(`userId and user: ${userId}, ${user}`);

    if (user) {
      console.log(`${userId} authenticated`)
      req.user = user;
      next();
    } else {
      console.log(`${userId} Not authenticated`)
      res.status(401).json({ message: "Not Authorized!" });
    }
  } catch (error) {
    console.log(`Server: not authenticated`)
    res.status(401).json({ message: "Not Authorized!" });
  }
};
