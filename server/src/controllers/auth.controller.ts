import { Request, Response } from "express";
import { printError } from "../utils/dev.js";
import { RegisterAuthResponse, RegisterRequestData } from "../types/data.js";
import User from "../models/user.model.js";
import { validateEmail, validateName } from "../utils/validators.js";
import { generateOtp } from "../utils/generators.js";
import { generateDate, hashText } from "../utils/util.js";
import EmailVerification from "../models/emailVerfication.model.js";
import { sendEmail } from "../services/email.service.js";
import { verifyEmailTemplate } from "../emails/verify-mail.js";

const OTP_EXPIRING_TIME = 10; // In minutes

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
    });
  } catch (error: any) {
    printError(error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to create your account",
    });
  }
};
