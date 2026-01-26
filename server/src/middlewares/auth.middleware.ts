import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Extending the Express Request globally to avoid typescript issue
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to check if the user is authenticated or not
export const isAuthenticated = async (
  req: Request,
  res: Response<{
    success: boolean;
    message: string;
  }>,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.cookies.token; // Getting the token
    if (!token) {
      // Token not found
      res.status(401).json({
        success: false,
        message: "Authentication missing, Please login...",
      });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;

    // Setting userId to req.userId
    req.userId = decoded as any as string;

    next(); // Forwarding request to next controller
  } catch (error) {
    res.status(500).json({
      message: "Invalid or expired token",
      success: false,
    });
  }
};
