import { Gender, UserProfile } from "./schema.js";

export interface BaseAuthResponse {
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
  dob?: string;
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

export interface UpdateProfileRequest {
  name: string;
  dob: Date;
  gender: Gender;
}

interface BaseUserResponse {
  success: boolean;
  message?: string;
}

export interface GetProfileResponse extends BaseUserResponse {
  profile?: UserProfile;
}

export interface SendVerificationMailRequestData {
  email: string;
}

export interface SendVerificationMailResponse extends BaseAuthResponse {
  userId?: string;
}
