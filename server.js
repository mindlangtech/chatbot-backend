import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"]
}));

app.use(bodyParser.json());

// Health check route
app.get("/", (req, res) => {
  res.json({ status: "server alive" });
});

// OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Experimental conditions
const prompts = {
  supportive: "You are a warm, empathetic tutor who encourages the user.",
  critical: "You are a critical evaluator who challenges the user.",
  neutral: "Keep your response always less than 80 words. You are a neutral assistant.",
};

app.post("/chat", async (req, res) => {
  try {
    const { message, participant_id, condition } = req.body;

    const systemPrompt = prompts[condition] || prompts.neutral;

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
    res.status(500).json({ error: error.message });
  }
});

// For Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on", PORT);
});