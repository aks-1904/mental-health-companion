export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  dob?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface VerifyEmailData {
  otp: string;
  userId: string;
}
