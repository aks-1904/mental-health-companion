import { Router } from "express";
import {
  getProfleData,
  updateProfile,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/", getProfleData);
router.put("/", updateProfile);

export default router;
