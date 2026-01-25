import { Schema } from "mongoose";

export interface IUser {
  email: string;
  passwordHash: string;
  name: string;
  verified: boolean;
}

export interface IEmailVerification {
  userId: Schema.Types.ObjectId;
  otpHash: String;
  expiresAt: Date; // Max 10 minutes
  attempts: Number; // Max 5 attempts
}
