import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/jwt.js";

export const generateToken = (user) => {
    return jwt.sign({ _id: user._id }, jwtSecret, {expiresIn: "1h"});
}