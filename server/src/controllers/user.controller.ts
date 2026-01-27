import { Request, Response } from "express";
import { GetProfileResponse, UpdateProfileRequest } from "../types/data.js";
import User from "../models/user.model.js";
import { printError } from "../utils/dev.js";
import { Gender } from "../types/schema.js";

export const getProfleData = async (
  req: Request,
  res: Response<GetProfileResponse>,
): Promise<void> => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const { passwordHash: _, ...userWithoutPassword } = user.toObject(); // Removing passwordHash to send the user profile data to frontend

    // Sending success response
    res.status(200).json({
      success: true,
      profile: userWithoutPassword,
    });
  } catch (error) {
    printError(error);
    res.status(500).json({
      success: false,
      message: "Cannot get profile data",
    });
    return;
  }
};

export const updateProfile = async (
  req: Request<{}, {}, UpdateProfileRequest>,
  res: Response<GetProfileResponse>,
): Promise<void> => {
  try {
    const { name, dob, gender } = req.body;
    const userId = req.userId;

    // Basic validation
    if (!name && !dob && !gender) {
      res.status(400).json({
        success: false,
        message: "No updating data is coming",
      });
      return;
    }

    if (gender != Gender.MALE && gender != Gender.FEMALE) {
      res.status(400).json({
        success: false,
        message: "Invalid gender",
      });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      // Checking if user exists
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Updating the data
    if (name) user.name == name;
    if (dob) user.dob == dob;
    if (gender) user.gender = gender;

    await user.save();

    const { passwordHash: _, ...userWithoutPassword } = user.toObject();

    res.status(200).json({
      success: false,
      message: "User data updated successfully",
      profile: userWithoutPassword,
    });
  } catch (error: any) {
    printError(error);
    res.status(500).json({
      success: false,
      message: error?.message || "Unable to update profile info",
    });
  }
};
