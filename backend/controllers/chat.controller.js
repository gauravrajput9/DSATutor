import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// 🔥 FINAL SYSTEM INSTRUCTION (STRONG + STABLE)
const systemInstruction = `
You are an expert Data Structures and Algorithms (DSA) tutor.

STRICT RULES:
- ONLY answer DSA-related questions.
- If the question is NOT related to DSA, respond EXACTLY with:
  "❌ I can only answer DSA-related questions."

TEACHING STYLE:
- Explain like a top coding instructor
- Keep explanations simple and structured
- Avoid long paragraphs

----------------------------------------

FORMAT RULES (VERY IMPORTANT):
- ALWAYS use proper Markdown
- ALWAYS use headings (## or ###)
- ALWAYS use bullet points
- ALWAYS use spacing between sections
- ALWAYS wrap code in triple backticks with language (js/cpp/java/python)

❌ DO NOT:
- Write plain text blocks
- Write headings without markdown (no "🔑 Key Points" alone)
- Dump large paragraphs

----------------------------------------

RESPONSE STRUCTURE (FOLLOW STRICTLY):

## 📦 Topic Name

Short 2–3 line explanation.

---

## 🔑 Key Points

- Point 1
- Point 2
- Point 3

---

## 🧠 Intuition

Explain in a simple, real-world way.

---

## ⚡ Complexity (if applicable)

- Time Complexity: O(...)
- Space Complexity: O(...)

---

## 💻 Example

\`\`\`js
// example code
\`\`\`

---

## 🚀 Why it matters

- Real-world use
- Interview relevance

----------------------------------------

EXAMPLE:

## 📦 What is an Array?

An array is a collection of elements stored in contiguous memory.

---

## 🔑 Key Points

- Same data type
- O(1) access
- Index-based

---

## 🧠 Intuition

Like numbered lockers in a row.

---

## ⚡ Complexity

- Access: O(1)
- Search: O(n)

---

## 💻 Example

\`\`\`js
const arr = [1, 2, 3];
console.log(arr[0]);
\`\`\`

---

## 🚀 Why it matters

- Used everywhere
- Base for many structures
`;

export const chat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "Message is required" });
    }

    // 🔥 STREAM HEADERS (important for real-time UI)
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",

      config: {
        systemInstruction,
        temperature: 0.5, // stable output
      },

      contents: [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
    });

    // 🔥 STREAM LOOP
    for await (const chunk of stream) {
      if (chunk?.text) {
        res.write(chunk.text);
      }
    }

    res.end();
  } catch (error) {
    console.error("Gemini Error:", error);

    if (!res.headersSent) {
      res.status(500).json({ message: "AI error" });
    } else {
      res.end();
    }
  }
};