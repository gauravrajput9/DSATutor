import { Router } from "express";
import { login, signup } from "../controllers/auth.controller.js";

const router = Router();

router.get("/signup", signup);
router.post("/login", login);

export default router;