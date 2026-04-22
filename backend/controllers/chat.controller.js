import Groq from "groq-sdk";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const ai = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const systemInstruction = `
You are an expert Data Structures and Algorithms tutor for interview preparation.

Scope rules:
- Only answer DSA-related questions.
- If the user asks something outside DSA, respond exactly with:
"I can only answer DSA-related questions."

Teaching goals:
- Be clear, practical, and modern.
- Adapt the depth to the question instead of forcing one rigid template every time.
- Start with the direct answer first, then expand.
`;

const buildSessionTitle = (text) => {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return "New chat";
  }

  return normalized.length > 60 ? `${normalized.slice(0, 57)}...` : normalized;
};

const normalizeHistory = (history = []) =>
  history
    .filter(
      (entry) =>
        entry &&
        (entry.role === "user" || entry.role === "bot") &&
        typeof entry.text === "string" &&
        entry.text.trim()
    )
    .map((entry) => ({
      role: entry.role === "bot" ? "assistant" : "user",
      content: entry.text.trim(),
    }));

export const getChatSessions = async (req, res) => {
  try {
    const sessions = (req.user.chatSessions || [])
      .slice()
      .sort(
        (a, b) =>
          new Date(b.lastMessageAt || b.updatedAt) -
          new Date(a.lastMessageAt || a.updatedAt)
      )
      .map((session) => ({
        id: session._id,
        title: session.title,
        updatedAt: session.updatedAt,
        lastMessageAt: session.lastMessageAt,
        messages: session.messages.map((message) => ({
          id: message._id,
          role: message.role,
          text: message.text,
          createdAt: message.createdAt,
        })),
      }));

    res.json({ sessions });
  } catch (error) {
    res.status(500).json({ message: "Could not load chat history." });
  }
};

export const chat = async (req, res) => {
  try {
    const { message, sessionId, history = [] } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "Message is required" });
    }

    const prompt = message.trim();
    const normalizedHistory = normalizeHistory(history);
    const existingSession = sessionId
      ? req.user.chatSessions.id(sessionId)
      : null;
    const activeSession =
      existingSession ||
      req.user.chatSessions.create({
        _id: new mongoose.Types.ObjectId(),
        title: buildSessionTitle(prompt),
        messages: [],
        lastMessageAt: new Date(),
      });

    if (!existingSession) {
      req.user.chatSessions.push(activeSession);
    }

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Chat-Session-Id", activeSession._id.toString());

    const stream = await ai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.5,
      stream: true,
      messages: [
        {
          role: "system",
          content: systemInstruction,
        },
        ...normalizedHistory,
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    let accumulated = "";

    for await (const chunk of stream) {
      const text = chunk?.choices?.[0]?.delta?.content;
      if (text) {
        accumulated += text;
        res.write(text);
      }
    }

    const answer = accumulated.trim() || "Unable to answer right now. Please try again.";

    activeSession.title = activeSession.title || buildSessionTitle(prompt);
    activeSession.messages.push(
      { role: "user", text: prompt },
      { role: "bot", text: answer }
    );
    activeSession.lastMessageAt = new Date();
    await req.user.save();

    res.end();
  } catch (error) {
    console.error("Groq Error:", error);

    if (!res.headersSent) {
      res.status(500).json({ message: "AI error" });
    } else {
      res.end();
    }
  }
};
