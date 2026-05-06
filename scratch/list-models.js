const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function list() {
  try {
    const models = await ai.models.list();
    console.log('Available Models:', JSON.stringify(models, null, 2));
  } catch (e) {
    console.error('List Models Failed:', e.message);
  }
}

list();
