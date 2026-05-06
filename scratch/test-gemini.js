const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function test() {
  console.log('Testing with API Key:', process.env.GEMINI_API_KEY ? 'Present' : 'Missing');
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: 'Hello',
    });
    console.log('Gemini 1.5 Success:', response.text);
  } catch (e) {
    console.error('Gemini 1.5 Failed:', e.message);
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: 'Hello',
    });
    console.log('Gemini 2.0 Success:', response.text);
  } catch (e) {
    console.error('Gemini 2.0 Failed:', e.message);
  }
}

test();
