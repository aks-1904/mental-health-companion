import { Request, Response } from "express";
import { printError } from "../utils/dev.js";
import { RegisterAuthResponse, RegisterRequestData } from "../types/data.js";
import User from "../models/user.model.js";
import { validateEmail, validateName } from "../utils/validators.js";
import { generateOtp } from "../utils/generators.js";
import { generateDate, hashText } from "../utils/util.js";

const OTP_EXPIRING_TIME = process.env.OTP_EXPIRING_TIME;
if (!OTP_EXPIRING_TIME || Number.isFinite(+OTP_EXPIRING_TIME)) {
  throw new Error("OTP expiring time not given or invalid otp expiring time");
}

export const register = async (
  req: Request,
  res: Response
): Promise<Response<RegisterAuthResponse>> => {
  try {
    const { email, password, name }: RegisterRequestData = req.body;

    if (!email || !password || !name) {
      // Bad request - Data missing
      return res.status(400).json({
        success: true,
        message: "Fill required details",
      });
    }

    // Checking for valid data
    if (!validateEmail(email)) {
      // Bad request - Invalid email
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    if (!validateName(name)) {
      // Bad request - Invalid name
      return res.status(400).json({
        success: false,
        message: "Invalid name",
      });
    }

    // Checking if user is exist for this email
    const user = await User.findOne({ email });
    if (!user) {
      // Conflict - User already exist
      return res.status(409).json({
        success: false,
        message: "User already exist with this email, login to continue",
      });
    }

    const otp = generateOtp(6); // Generating OTP of length 6
    const passwordHash = await hashText(password); // Hashing the password before saving to DB
    const otpExpiresDate = generateDate(new Date(), +OTP_EXPIRING_TIME); // Generate Date after 10 minutes from now

    // Saving data in DB
    await User.create({
      email,
      passwordHash,
      otp,
      otpExpiresAt: otpExpiresDate,
      name,
    });

    // Sending OTP to user using mailtrap

    return res.status(200).json({
      success: true,
      message: "Verification email sended",
    });
  } catch (error: any) {
    printError(error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to create your account",
    });
  }
};
