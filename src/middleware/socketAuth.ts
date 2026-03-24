import jwt from "jsonwebtoken";
import User from "../models/User.js";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;

export async function authenticateSocket(token: string) {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as { userId: string; username: string };

    if (!decoded || !decoded.userId) return null;

    const user = await User.findById(decoded.userId);
    if (!user) return null;

    return user;
  } catch (err) {
    console.log("Socket auth error:", err);
    return null;
  }
}