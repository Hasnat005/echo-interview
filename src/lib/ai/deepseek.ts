import "server-only";

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";

const DEFAULT_TIMEOUT_MS = 30_000;

export type DeepSeekMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

/**
 * Server-only DeepSeek chat wrapper. Do not import in client components.
 */
export async function deepSeekChat(
  messages: DeepSeekMessage[],
  options?: { temperature?: number; maxTokens?: number; signal?: AbortSignal },
): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY is not set.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens,
      }),
      signal: options?.signal ?? controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(`DeepSeek request failed (${response.status}): ${errorText}`);
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("DeepSeek response missing content.");
    }

    return content;
  } finally {
    clearTimeout(timeout);
  }
}
