// Simple per-visitor daily counter for the free tier.
// In-memory: it resets when a server instance restarts and is per instance.
// Swap for a shared store (e.g. Upstash Redis / Vercel KV) before relying on it for cost control.
const buckets = new Map<string, { day: string; count: number }>();

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function freeLimit(): number {
  const n = Number(process.env.FREE_GENERATIONS_PER_DAY ?? "5");
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 5;
}

export function checkAndCount(visitor: string): { allowed: boolean; remaining: number } {
  const limit = freeLimit();
  const day = today();
  const entry = buckets.get(visitor);
  const used = entry && entry.day === day ? entry.count : 0;
  if (used >= limit) return { allowed: false, remaining: 0 };
  buckets.set(visitor, { day, count: used + 1 });
  if (buckets.size > 50000) {
    for (const [k, v] of buckets) if (v.day !== day) buckets.delete(k);
  }
  return { allowed: true, remaining: limit - used - 1 };
}

export function visitorId(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  return (fwd ? fwd.split(",")[0] : headers.get("x-real-ip") || "unknown").trim();
}
