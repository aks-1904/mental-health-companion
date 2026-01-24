import mongoose from "mongoose";
import { IUser } from "../types/user.js";

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    otp: String,
    otpExpiresAt: Date,
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;
