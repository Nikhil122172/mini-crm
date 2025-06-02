// routes/ai.js
const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPEN_API,
});

router.post('/generate', async (req, res) => {
  const { name } = req.body;

  try {
    const prompt = `Generate a personalized marketing message for a campaign named "${name}". Make it friendly and engaging.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
      temperature: 0.7,
    });

    const generatedMessage = response.choices[0].message.content.trim();
    res.json({ message: generatedMessage });
  } catch (error) {
    console.error("AI error:", error);
    res.status(500).json({ error: "AI generation failed" });
  }
});

module.exports = router;


routes/ai.js
