import { mockProducts } from "@/lib/data/products";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent?key=${GEMINI_API_KEY}&alt=sse`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const productContext = mockProducts.map(p => ({
      name: p.name,
      price: p.price,
      description: p.description,
      category: Array.isArray(p.category) ? p.category.join(", ") : p.category,
    }));

    const systemPrompt = `أنت خبير عطور فاخر يعمل لدى متجر "لوفلي سميل" (Lovely Smell)، وهو بوتيك عطور راقٍ في مصر.
هدفك تقديم خدمة عملاء استثنائية وأنيقة ومفيدة.

إرشادات:
- الأسلوب: راقٍ ومرحِّب ومحترف.
- اللغة: عربي بالدرجة الأولى (مصري/فصحى)، مع دعم الإنجليزية إن تحدث بها المستخدم.
- الخبرة: معرفة واسعة بنوتات العطور (شرقي، غربي، عود، مسك، إلخ).
- الهدف البيعي: مساعدة المستخدم في إيجاد عطره المثالي وتوجيهه نحو الشراء.

معلومات عن المتجر:
- لوفلي سميل متخصص في العطور الفاخرة الشرقية والغربية.
- نوفر توصيلاً سريعاً لجميع محافظات مصر.
- مكوناتنا من أعلى مستوى جودة.

كتالوج المنتجات:
${JSON.stringify(productContext, null, 2)}

تعليمات:
- إذا طلب المستخدم توصيات، اقترح 2-3 منتجات من الكتالوج بناءً على تفضيلاته.
- إذا سأل عن منتج بعينه، قدّم تفاصيله من الكتالوج.
- إذا خرج عن موضوع العطور، أعِد توجيهه بلطف.
- اجعل ردودك موجزة لكن مفيدة.`;

    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const body = {
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },
      contents,
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.7,
      },
    };

    const geminiRes = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error:", errText);
      return new Response(JSON.stringify({ error: "Gemini API error", details: errText }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Stream SSE from Gemini, extract text chunks and forward as plain text
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const reader = geminiRes.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const jsonStr = line.slice(6).trim();
                if (jsonStr === "[DONE]") continue;
                try {
                  const parsed = JSON.parse(jsonStr);
                  const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (text) {
                    controller.enqueue(encoder.encode(text));
                  }
                } catch {
                  // skip invalid JSON lines
                }
              }
            }
          }
          controller.close();
        } catch (err) {
          console.error("Stream read error:", err);
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Chat API Error:", msg);
    return new Response(JSON.stringify({ error: "Failed to process chat", details: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
