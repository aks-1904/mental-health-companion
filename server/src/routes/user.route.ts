import { Router } from "express";
import { getProfleData } from "../controllers/user.controller.js";

const router = Router();

router.get("/", getProfleData);

export default router;
