import { UserProfile } from "./schema.js";

interface BaseAuthResponse {
  success: boolean;
  message: string;
}

export interface RegisterResponse extends BaseAuthResponse {
  userId?: string;
}

export interface VerifyEmailResponse extends BaseAuthResponse {
  profile?: UserProfile;
}

export interface LoginResponse extends BaseAuthResponse {
  profile?: UserProfile;
}

export interface VerifyEmailRequestData {
  otp: string;
  userId: string;
}

export interface RegisterRequestData {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequestData {
  email: string;
  password: string;
}

export type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};
