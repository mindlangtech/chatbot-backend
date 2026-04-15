import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

<<<<<<< HEAD
<<<<<<< HEAD
const app = express();
=======
app.get("/", (req, res) => {
  res.json({ status: "server alive" });
});
>>>>>>> parent of f3f82c8 (fix)
=======
app.get("/", (req, res) => {
  res.json({ status: "server alive" });
});
>>>>>>> parent of f3f82c8 (fix)

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"]
}));
app.use(bodyParser.json());

<<<<<<< HEAD
<<<<<<< HEAD
// Health check route
app.get("/", (req, res) => {
  res.json({ status: "server alive" });
});

=======
>>>>>>> parent of f3f82c8 (fix)
=======
>>>>>>> parent of f3f82c8 (fix)
// OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 🎯 Experimental conditions
const prompts = {
  supportive: "You are a warm, empathetic tutor who encourages the user.",
  critical: "You are a critical evaluator who challenges the user.",
  neutral: "You are a neutral assistant.",
};

app.post("/chat", async (req, res) => {
  try {
    const { message, participant_id, condition } = req.body;

    const systemPrompt = prompts[condition] || prompts.neutral;

    // Opener logic (BOT STARTS FIRST)
    if (!message || message.trim() === "") {
      let opener = "Hello! Thank you for participating. I will ask you a few questions. Let’s begin: What is your opinion on social media?";

      // Optional: vary by condition
      if (condition === "supportive") {
        opener = "Hi there! 😊 I'm really glad you're here. Let’s start: What is your opinion on social media?";
      } else if (condition === "critical") {
        opener = "Let’s begin. What is your opinion on social media? Please be precise.";
      }

      return res.json({ reply: opener });
    }

    // Normal OpenAI response
    const completion = await client.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = completion.output_text;

    // 🔐 Log data (for research)
    console.log({
      participant_id,
      condition,
      message,
      reply,
      timestamp: new Date(),
    });

    res.json({ reply });

  } catch (error) {
    console.error("FULL ERROR:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on", PORT);
});