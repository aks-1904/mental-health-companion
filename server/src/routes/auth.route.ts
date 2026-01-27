import { Router } from "express";
import {
  logout,
  login,
  register,
  verifyEmail,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.get("/logout", logout);

export default router;
