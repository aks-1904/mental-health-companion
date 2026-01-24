export interface IUser {
  email: string;
  passwordHash: string;
  name: string;
  verified: boolean;
  otp: string;
  otpExpiresAt: Date; // Valid only for 10 minutes
}
