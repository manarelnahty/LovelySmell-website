import { GoogleGenAI } from '@google/genai';
import { mockProducts } from '@/lib/data/products';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Prepare product context
    const productContext = mockProducts.map(p => ({
      name: p.name,
      price: p.price,
      description: p.description,
      category: p.category.join(', ')
    }));

    const systemPrompt = `You are a luxury perfume expert for 'Lovely Smell' (لوفلي سميل), a high-end fragrance boutique in Egypt. 
    Your goal is to provide exceptional, elegant, and helpful customer service.
    
    Guidelines:
    - Tone: Sophisticated, welcoming, and professional.
    - Language: Primarily Arabic (Egyptian/Standard), but support English if the user speaks it.
    - Expertise: Knowledgeable about perfume notes (oriental, western, oud, musk, etc.).
    - Sales Goal: Help users find their perfect scent and guide them towards a purchase.
    
    Brand Info:
    - Lovely Smell specializes in luxury oriental and western fragrances.
    - We offer fast delivery across all of Egypt.
    - Our ingredients are of the highest quality.
    
    Product Catalog:
    ${JSON.stringify(productContext, null, 2)}
    
    Instructions:
    - If a user asks for recommendations, suggest 2-3 products from the catalog based on their preferences (e.g., gender, season, scent type).
    - If they ask about a specific product, provide details from the catalog.
    - If they ask about something not related to perfumes or Lovely Smell, politely steer them back to fragrances.
    - Keep responses concise but helpful.
    - Mention that we have fast delivery in Egypt if relevant.
    `;

    console.log('Sending request to Gemini with model: gemini-flash-latest');
    
    const result = await ai.models.generateContentStream({
      model: 'gemini-flash-latest',
      contents: messages.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })),
      config: {
        systemInstruction: systemPrompt,
        maxOutputTokens: 1000,
      }
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result) {
            const text = chunk.text;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error: any) {
    console.error('Chat API Error Full Details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      status: error.status,
      details: error.details
    });
    return new Response(JSON.stringify({ 
      error: 'Failed to process chat',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
