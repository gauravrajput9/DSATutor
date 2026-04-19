import { Router } from "express";
import { getMe, login, logout, signup } from "../controllers/auth.controller.js";

const router = Router();

router.get("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.post("/me",getMe);

export default router;