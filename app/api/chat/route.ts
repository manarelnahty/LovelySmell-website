import { mockProducts } from "@/lib/data/products";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const GEMINI_MODEL = "gemini-1.5-flash";

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

    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: systemPrompt,
    });

    const chat = model.startChat({
      history: messages.slice(0, -1).map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      })),
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.7,
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
