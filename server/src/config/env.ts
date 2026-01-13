import dotenv from "dotenv";

dotenv.config();

const required = ["MONGO_URI", "JWT_SECRET", "CLIENT_URL", "NODE_ENV"];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing key: ${key}`);
  }
}
