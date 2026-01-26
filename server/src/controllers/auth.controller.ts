import { CookieOptions, Request, Response } from "express";
import { printError } from "../utils/dev.js";
import {
  RegisterResponse,
  RegisterRequestData,
  VerifyEmailResponse,
  LoginResponse,
  LoginRequestData,
} from "../types/data.js";
import User from "../models/user.model.js";
import { validateEmail, validateName } from "../utils/validators.js";
import { generateOtp } from "../utils/generators.js";
import { compareHashedString, generateDate, hashText } from "../utils/util.js";
import EmailVerification from "../models/emailVerfication.model.js";
import { sendEmail } from "../services/email.service.js";
import { verifyEmailTemplate } from "../emails/verify-mail.js";
import jwt from "jsonwebtoken";

const OTP_EXPIRING_TIME = 10; // In minutes
const JWT_SECRET = process.env.JWT_SECRET;
const isProduction = process.env.NODE_END === "production";

export const register = async (
  req: Request,
  res: Response,
): Promise<Response<RegisterResponse>> => {
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
    let user = await User.findOne({ email });
    if (user) {
      // Conflict - User already exist
      return res.status(409).json({
        success: false,
        message: "User already exist with this email, login to continue",
      });
    }

    const otp = generateOtp(6); // Generating OTP of length 6
    const otpHash = await hashText(otp);
    const passwordHash = await hashText(password); // Hashing the password before saving to DB
    const otpExpiresDate = generateDate(new Date(), Number(OTP_EXPIRING_TIME)); // Generate Date after 10 minutes from now

    // Saving data in DB
    user = await User.create({
      email,
      passwordHash,
      name,
    });

    // Sending verification message
    await EmailVerification.deleteMany({ userId: user?._id as any }); // Deleting every other email verification document with same userId
    await EmailVerification.create({
      userId: user?._id as any,
      otpHash,
      expiresAt: otpExpiresDate,
    });

    await sendEmail({
      to: email,
      subject: "Verify your email",
      html: verifyEmailTemplate(otp, name),
    });

    return res.status(201).json({
      success: true,
      message: "Verification email sended",
      userId: user?._id,
    });
  } catch (error: any) {
    printError(error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to create your account",
    });
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
): Promise<Response<VerifyEmailResponse>> => {
  try {
    const { otp, userId } = req.body;

    const record = await EmailVerification.findOne({ userId });

    // Checking if record is available
    if (!record) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    if (record.expiresAt < new Date()) {
      // OTP expires
      return res.status(400).json({
        success: false,
        message: "Expired OTP, request for another one",
      });
    }

    if ((record.attempts as number) > 5) {
      // Maximum 5 request allowed
      return res.status(429).json({
        success: false,
        message: "Too many attempts",
      });
    }

    const isValid = await compareHashedString(otp, record.otpHash as string);
    if (!isValid) {
      // OTP given is not valid
      record.attempts += 1 as any;
      await record.save();

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Updating user in database
    await User.findByIdAndUpdate(userId, {
      verified: true,
    });
    // Deleting email verification document
    await EmailVerification.deleteOne({ _id: record?._id });

    return res.status(200).json({
      success: true,
      message: "Account verified successfully",
    });
  } catch (error: any) {
    printError(error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to verify you email",
    });
  }
};

export const login = async (
  req: Request<{}, {}, LoginRequestData>,
  res: Response<LoginResponse>,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // If user with given email is not found
      res.status(404).json({
        success: false,
        message: "Email or password is invalid",
      });
      return;
    }

    const isValidPass = compareHashedString(password, user.passwordHash);
    if (!isValidPass) {
      // Given password doesn't match with database
      res.status(401).json({
        success: false,
        message: "Email or password is invalid",
      });
      return;
    }

    if (!user.verified) {
      // Email isn't verified
      res.status(401).json({
        success: false,
        message: "Your account isn't verified, first verify your account",
      });
    }

    const token = jwt.sign(user._id, JWT_SECRET as string); // Generate token value
    const tokenOptions: CookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      domain: isProduction ? process.env.DOMAIN : undefined,
    };

    // Seeting cookie to client
    res.cookie("token", token, tokenOptions);

    res.status(200).json({
      success: false,
      message: "Logged in successfully",
    });
    return;
  } catch (error: any) {
    printError(error);
    res.status(500).json({
      success: false,
      message: error?.message || "Unable to login to your account",
    });
    return;
  }
};
