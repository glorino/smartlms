import OpenAI from "openai";

let openai: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (!openai) {
    const key = process.env.OPENAI_API_KEY;
    if (!key || key === "sk_placeholder") {
      throw new Error("OPENAI_API_KEY is not configured");
    }
    openai = new OpenAI({ apiKey: key });
  }
  return openai;
}

export async function chatCompletion(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  options?: { model?: string; maxTokens?: number; temperature?: number }
): Promise<string> {
  const client = getOpenAI();
  const response = await client.chat.completions.create({
    model: options?.model || "gpt-4o-mini",
    messages,
    max_tokens: options?.maxTokens || 1024,
    temperature: options?.temperature ?? 0.7,
  });
  return response.choices[0]?.message?.content || "";
}

export async function generateEmbeddings(text: string): Promise<number[]> {
  const client = getOpenAI();
  const response = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding;
}

export async function generateJSON<T>(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  options?: { model?: string; maxTokens?: number }
): Promise<T> {
  const client = getOpenAI();
  const response = await client.chat.completions.create({
    model: options?.model || "gpt-4o-mini",
    messages: [...messages, { role: "user" as const, content: "Respond ONLY with valid JSON, no markdown, no explanation." }],
    max_tokens: options?.maxTokens || 2048,
    temperature: 0.3,
    response_format: { type: "json_object" },
  });
  const content = response.choices[0]?.message?.content || "{}";
  return JSON.parse(content) as T;
}
