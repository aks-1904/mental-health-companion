import { Schema } from "mongoose";

export interface IUser {
  email: string;
  passwordHash: string;
  name: string;
  verified: boolean;
}

// Removing passwordHash as an mandatory in UserProfile data
export type UserProfile = Omit<IUser, "passwordHash">;

export interface IEmailVerification {
  userId: Schema.Types.ObjectId;
  otpHash: string;
  expiresAt: Date; // Max 10 minutes
  attempts: number; // Max 5 attempts
}
