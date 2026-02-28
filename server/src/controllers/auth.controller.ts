import { CookieOptions, Request, Response } from "express";
import { Types } from "mongoose";
import { printError } from "../utils/dev.js";
import {
  RegisterResponse,
  RegisterRequestData,
  VerifyEmailResponse,
  LoginResponse,
  LoginRequestData,
  VerifyEmailRequestData,
  BaseAuthResponse,
} from "../types/data.js";
import User from "../models/user.model.js";
import {
  validateDOB,
  validateEmail,
  validateName,
} from "../utils/validators.js";
import { generateOtp } from "../utils/generators.js";
import { compareHashedString, generateDate, hashText } from "../utils/util.js";
import EmailVerification from "../models/emailVerfication.model.js";
import { sendEmail } from "../services/email.service.js";
import { verifyEmailTemplate } from "../emails/verify-mail.js";
import jwt from "jsonwebtoken";

const OTP_EXPIRING_TIME = 10; // In minutes
const JWT_SECRET = process.env.JWT_SECRET;
const isProduction = process.env.NODE_END === "production";

const tokenOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "strict" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  domain: isProduction ? process.env.DOMAIN : undefined,
};

export const register = async (
  req: Request<{}, {}, RegisterRequestData>,
  res: Response<RegisterResponse>,
): Promise<void> => {
  try {
    const { email, password, name, dob } = req.body;

    if (!email || !password || !name) {
      // Bad request - Data missing
      res.status(400).json({
        success: true,
        message: "Fill required details",
      });
      return;
    }

    // Checking for valid data
    if (!validateEmail(email)) {
      // Bad request - Invalid email
      res.status(400).json({
        success: false,
        message: "Invalid email",
      });
      return;
    }

    if (!validateName(name)) {
      // Bad request - Invalid name
      res.status(400).json({
        success: false,
        message: "Invalid name",
      });
      return;
    }

    if (dob && !validateDOB(dob)) {
      // Bad request - Invalid DOB
      res.status(400).json({
        success: false,
        message: "Invalid Date of birth",
      });
    }

    // Checking if user is exist for this email
    let user = await User.findOne({ email });
    if (user) {
      // Conflict - User already exist
      res.status(409).json({
        success: false,
        message: "User already exist with this email, login to continue",
      });
      return;
    }

    const otp = generateOtp(6); // Generating OTP of length 6
    const otpHash = await hashText(otp);
    const passwordHash = await hashText(password); // Hashing the password before saving to DB
    const otpExpiresDate = generateDate(new Date(), Number(OTP_EXPIRING_TIME)); // Generate Date after 10 minutes from now

    // Making DB query
    let userQuery: any = { email, passwordHash, name };
    if (dob) userQuery.dob = dob;

    // Saving data in DB
    user = await User.create(userQuery);

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

    res.status(201).json({
      success: true,
      message: "Verification email sended",
      userId: user?._id as any as string,
    });
    return;
  } catch (error: any) {
    printError(error);
    res.status(500).json({
      success: false,
      message: error?.message || "Failed to create your account",
    });
    return;
  }
};

export const verifyEmail = async (
  req: Request<{}, {}, VerifyEmailRequestData>,
  res: Response<VerifyEmailResponse>,
): Promise<void> => {
  try {
    const { otp, userId } = req.body;

    const record = await EmailVerification.findOne({
      userId,
    } as any);

    // Checking if record is available
    if (!record) {
      res.status(400).json({
        success: false,
        message: "OTP not found",
      });
      return;
    }

    if (record.expiresAt < new Date()) {
      // OTP expires
      res.status(400).json({
        success: false,
        message: "Expired OTP, request for another one",
      });
      return;
    }

    if ((record.attempts as number) > 5) {
      // Maximum 5 request allowed
      res.status(429).json({
        success: false,
        message: "Too many attempts",
      });
      return;
    }

    const isValid = await compareHashedString(otp, record.otpHash as string);
    if (!isValid) {
      // OTP given is not valid
      record.attempts += 1 as any;
      await record.save();

      res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
      return;
    }

    // Updating user in database
    await User.findByIdAndUpdate(userId, {
      verified: true,
    });
    // Deleting email verification document
    await EmailVerification.deleteOne({ _id: record?._id });

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const { passwordHash: _, ...userWithoutPassword } = user.toObject();
    const token = jwt.sign({ userId: user?._id }, JWT_SECRET as string); // Generating token

    // Setting token to client
    res.cookie("token", token, tokenOptions);

    res.status(200).json({
      success: true,
      message: "Account verified successfully",
      profile: userWithoutPassword,
    });
    return;
  } catch (error: any) {
    printError(error);
    res.status(500).json({
      success: false,
      message: error?.message || "Failed to verify you email",
    });
    return;
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

    // Seeting cookie to client
    res.cookie("token", token, tokenOptions);

    const { passwordHash: _, ...userWithoutPassword } = user.toObject();

    res.status(200).json({
      success: false,
      message: "Logged in successfully",
      profile: userWithoutPassword,
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

export const logout = async (
  _: Request,
  res: Response<BaseAuthResponse>,
): Promise<void> => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error: any) {
    printError(error);
    res.status(500).json({
      success: false,
      message: error?.message || "Some error occured",
    });
  }
};
