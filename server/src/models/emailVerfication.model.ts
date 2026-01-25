import mongoose, { Schema } from "mongoose";
import { IEmailVerification } from "../types/schema.js";

const emailVerificationSchema = new Schema<IEmailVerification>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const EmailVerificationModel = mongoose.model(
  "EmailVerification",
  emailVerificationSchema
);

export default EmailVerificationModel;
