import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { chat, getChatSessions } from "../controllers/chat.controller.js";

const router = Router();

router.get("/test", (req, res) => {
  res.json({ message: "Chat route is working!" });
});

router.get("/sessions", isAuthenticated, getChatSessions);
router.post("/message", isAuthenticated, chat);

export default router;
