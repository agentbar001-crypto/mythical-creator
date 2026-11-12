import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { ExtractionSchema, GenerateRequestSchema, systemFor, userPromptFor } from "@/lib/prompts";
import { checkAndCount, visitorId } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const MODEL = "claude-opus-5-5";
const FALLBACK_BETA = "server-side-fallback-2026-07-01";

function json(status: number, body: Record<string, unknown>, extra?: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store", ...extra },
  });
}

function errorResponse(error: unknown) {
  if (error instanceof Anthropic.AuthenticationError) {
    return json(401, { error: "That API key was rejected. Check it in the AI settings tab." });
  }
  if (error instanceof Anthropic.RateLimitError) {
    return json(429, { error: "The AI service is busy right now. Try again in a minute." });
  }
  if (error instanceof Anthropic.BadRequestError) {
    return json(400, { error: "The AI service couldn't process this request." });
  }
  if (error instanceof Anthropic.APIError) {
    return json(502, { error: "The AI service had a problem. Try again shortly." });
  }
  return json(500, { error: "Something went wrong while generating." });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "Invalid request." });
  }

  const parsed = GenerateRequestSchema.safeParse(body);
  if (!parsed.success) {
    return json(400, { error: "Invalid request." });
  }
  const req = parsed.data;

  // Bring-your-own-key takes priority and is never stored or logged.
  const userKey = request.headers.get("x-user-api-key")?.trim();
  const serverKey = process.env.ANTHROPIC_API_KEY;
  let remaining: number | null = null;

  if (!userKey) {
    if (!serverKey) {
      return json(503, { error: "AI generation isn't set up on this server yet. Add your own key in the AI settings tab.", code: "no_server_key" });
    }
    const quota = checkAndCount(visitorId(request.headers));
    if (!quota.allowed) {
      return json(429, { error: "You've used today's free AI generations. Add your own Anthropic key in the AI settings tab to keep going.", code: "free_limit" });
    }
    remaining = quota.remaining;
  }

  const client = new Anthropic({ apiKey: userKey || serverKey, maxRetries: 2 });
  const quotaHeaders: Record<string, string> = remaining === null ? {} : { "x-free-remaining": String(remaining) };
  const messages = [{ role: "user" as const, content: userPromptFor(req) }];

  if (req.task === "extract") {
    try {
      const response = await client.beta.messages.parse({
        model: MODEL,
        max_tokens: 4000,
        betas: [FALLBACK_BETA],
        fallbacks: "default",
        output_config: { effort: "low", format: betaZodOutputFormat(ExtractionSchema) },
        system: systemFor("extract"),
        messages,
      });
      if (response.stop_reason === "refusal" || !response.parsed_output) {
        return json(422, { error: "The AI couldn't tag this memory. Try the offline extractor or tag it by hand." }, quotaHeaders);
      }
      const out = response.parsed_output;
      const allowedW = new Set(req.options.wounds);
      const allowedG = new Set(req.options.gifts);
      return json(200, {
        wounds: out.wounds.filter((w) => allowedW.has(w)),
        gifts: out.gifts.filter((g) => allowedG.has(g)),
        symbols: out.symbols.slice(0, 8),
        arc: out.arc.slice(0, 4),
        summary: out.summary,
      }, quotaHeaders);
    } catch (error) {
      return errorResponse(error);
    }
  }

  const effort = req.task === "style" ? "low" : "medium";
  let stream;
  try {
    stream = client.beta.messages.stream({
      model: MODEL,
      max_tokens: 16000,
      betas: [FALLBACK_BETA],
      fallbacks: "default",
      output_config: { effort },
      system: systemFor(req.task),
      messages,
    });
    // Surface auth/quota errors before we commit to a 200 streaming response.
    await stream.withResponse();
  } catch (error) {
    return errorResponse(error);
  }

  const encoder = new TextEncoder();
  const body$ = new ReadableStream<Uint8Array>({
    async start(controller) {
      let wroteText = false;
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            wroteText = true;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal" && !wroteText) {
          controller.enqueue(encoder.encode("[The AI declined to write this piece. Try rewording the memory, or use the offline draft.]"));
        }
      } catch {
        controller.enqueue(encoder.encode(wroteText ? "\n\n[Generation was interrupted. Try again.]" : "[Generation failed. Try again.]"));
      } finally {
        controller.close();
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body$, {
    status: 200,
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store", ...quotaHeaders },
  });
}
