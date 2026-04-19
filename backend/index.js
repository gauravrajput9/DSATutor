import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./util/db.js";
import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.route.js";
import cookieParser from "cookie-parser";

dotenv.config();
await connectDB();

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("API running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});