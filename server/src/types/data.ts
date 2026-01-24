import { IUser } from "./user.js";

interface BaseAuthResponse {
  success: boolean;
  message: string;
}

export interface RegisterAuthResponse extends BaseAuthResponse {
  profile?: IUser;
}

export interface RegisterRequestData {
  email: string;
  password: string;
  name: string;
}
