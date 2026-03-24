import User from "../models/User.js";
import crypto from "crypto";

export async function registerUser(data: any) {
  const { email, password, username, profile, role } = data;

  const emailToken = crypto.randomBytes(32).toString("hex");

  const user = new User({
    email,
    password,
    username,
    profile,
    emailVerificationToken: emailToken,
    role,
  });

  await user.save();

  return { success: true, data: user };
}
