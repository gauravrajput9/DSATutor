import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { chat } from "../controllers/chat.controller.js";

const router = Router();
// Example route
router.get("/test", (req, res) => {
  res.json({ message: "Chat route is working!" });
});

router.post("/message", isAuthenticated, chat);

export default router;