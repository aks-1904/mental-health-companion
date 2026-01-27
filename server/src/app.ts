import express from "express";
import cors from "cors";
import CookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import { isAuthenticated } from "./middlewares/auth.middleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

// Default middlewares
app.use(express.json());
app.use(CookieParser());

// Created rest API's
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", isAuthenticated, userRoutes);

if (process.env.NODE_ENV !== "production") {
  const morgan = (await import("morgan")).default;
  app.use(morgan("dev"));
}

export default app;
