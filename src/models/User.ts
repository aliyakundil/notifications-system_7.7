import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    trim: true,
    unique: true
  },
  email:  {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
  profile: {
    firstName: String,
    lastName: String,
    bio: String,
  },
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: String,
  refreshToken: {
    type: [String],
    default: [],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
}
export default mongoose.model("User", userSchema);