import { mockProducts } from "@/lib/data/products";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const GEMINI_MODEL = "gemini-3.1-flash-lite";

// Pre-compute product context once at module level (not per request)
const productContext = mockProducts
  .map(
    (p) =>
      `• ${p.name} — ${p.price} ج.م | ${Array.isArray(p.category) ? p.category.join("، ") : p.category} | ${p.description}`
  )
  .join("\n");

const systemPrompt = `أنت مساعد عطور أنيق لمتجر "لوفلي سميل" (Lovely Smell) في مصر.

قواعد صارمة:
- أجب في ٣ أسطر كحد أقصى. كن مختصراً وأنيقاً.
- لا تكرر الترحيب. رحّب فقط في أول رسالة.
- اقترح ١-٢ منتج فقط عند الطلب.
- إذا خرج عن العطور، أعِد توجيهه بلطف.
- استخدم عربي فصيح مبسّط.

الكتالوج:
${productContext}

معلومات: توصيل لجميع المحافظات، الدفع عند الاستلام متاح.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: systemPrompt,
    });

    const chatHistory = messages.slice(0, -1).map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    // Gemini requires the first message in history to be from the user.
    if (chatHistory.length > 0 && chatHistory[0].role === "model") {
      chatHistory.shift();
    }

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 250,
        temperature: 0.6,
      },
    });

    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessageStream(lastMessage);

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              controller.enqueue(encoder.encode(chunkText));
            }
          }
          controller.close();
        } catch (err) {
          console.error("Stream error:", err);
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Chat API Error:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to process chat",
        details: msg,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
