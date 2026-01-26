import { IUser } from "./schema.js";

interface BaseAuthResponse {
  success: boolean;
  message: string;
}

export interface RegisterResponse {
  userId?: string;
}

export interface VerifyEmailResponse extends BaseAuthResponse {
  profile?: IUser;
}

export interface LoginResponse extends BaseAuthResponse {
  profile?: IUser;
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
