import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import 'dotenv/config';
import { sanitizeTask } from './sanitizeUtils.js';

const app = express();
app.use(cors());
app.use(express.json());

// 1. Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 2. Define Shared Schemas for Structured JSON Output
const decomposeSchema = {
  type: SchemaType.OBJECT,
  properties: {
    steps: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          step: { type: SchemaType.STRING },
          time: { type: SchemaType.NUMBER }
        },
        required: ["step", "time"]
      }
    }
  },
  required: ["steps"]
};

const stuckSchema = {
  type: SchemaType.OBJECT,
  properties: {
    smallerSteps: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING }
    },
    options: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING }
    },
    encouragement: { type: SchemaType.STRING }
  },
  required: ["smallerSteps", "options", "encouragement"]
};

// --- ROUTE 1: MAIN DECOMPOSITION ---
app.post('/api/decompose', async (req, res) => {
  try {
   const { task, prefs } = req.body;
    
    // --- NEW: Sanitize the input first! ---
    const cleantask = sanitizeTask(task);


    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: decomposeSchema
      }
    });

    const prompt = `
      Task: "${cleantask}"
      User Preferences: ${JSON.stringify(prefs)}
      
      Role: Neuro-inclusive executive function coach.
      Goal: Break this task into clear, actionable micro-wins.
      Constraints: 
      - Max 8 steps.
      - Exactly one action per step.
      - Under 12 words per step.
      - If 'tinySteps' is true, make actions even simpler.
    `;

    const result = await model.generateContent(prompt);
    res.json(JSON.parse(result.response.text()));

  } catch (error) {
    console.error("Decompose Error:", error);
    res.status(500).json({ error: "Failed to break down task." });
  }
});

// --- ROUTE 2: THE "SQUEEZE SMALLER" (STUCK) LOGIC ---
app.post('/api/stuck', async (req, res) => {
  try {
    const { currentStepText } = req.body;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: stuckSchema
      }
    });

    const prompt = `
      The user is overwhelmed by this specific step: "${currentStepText}".
      
      Instructions:
      1. Break this ONE step into 3 tiny actions that take less than 30 seconds each.
      2. Provide two options: "Continue for 2 minutes" and "Skip this step".
      3. Write one short, warm sentence of encouragement.
    `;

    const result = await model.generateContent(prompt);
    res.json(JSON.parse(result.response.text()));

  } catch (error) {
    console.error("Stuck Error:", error);
    res.status(500).json({ error: "Failed to simplify further." });
  }
});

// --- SERVER START ---
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`
  🚀 Smart Companion Backend Running
  📡 URL: http://localhost:${PORT}
  🤖 Gemini: 1.5-Flash Active
  `);
});