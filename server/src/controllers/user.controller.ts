import { Request, Response } from "express";
import { GetProfileResponse } from "../types/data.js";
import User from "../models/user.model.js";
import { printError } from "../utils/dev.js";

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
