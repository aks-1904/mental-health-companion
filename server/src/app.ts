import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

if (process.env.NODE_ENV !== "production") {
  const morgan = (await import("morgan")).default;
  app.use(morgan("dev"));
}

export default app;
