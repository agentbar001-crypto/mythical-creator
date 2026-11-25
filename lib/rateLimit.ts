import { createHash } from "node:crypto";

// Daily free-tier limits on the server key.
// Uses Upstash Redis (Vercel Marketplace) when its REST env vars are set, so the
// count is shared across every server instance. Without them it falls back to an
// in-memory counter, which is fine for local dev but resets per instance.
// Visitor IPs are hashed before they are used as keys; raw IPs are never stored.

type Quota = { allowed: boolean; remaining: number };

const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const TTL_SECONDS = 60 * 60 * 26;

const memory = new Map<string, { day: string; count: number }>();

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function readLimit(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : fallback;
}

export function freeLimit(): number {
  return readLimit("FREE_GENERATIONS_PER_DAY", 5);
}

/** Site-wide cap on free generations per day, protecting the server key's bill. 0 = no cap. */
export function globalLimit(): number {
  return readLimit("FREE_GENERATIONS_GLOBAL_PER_DAY", 500);
}

async function redisIncr(key: string): Promise<number> {
  const res = await fetch(`${REDIS_URL}/pipeline`, {
    method: "POST",
    headers: { authorization: `Bearer ${REDIS_TOKEN}`, "content-type": "application/json" },
    body: JSON.stringify([
      ["INCR", key],
      ["EXPIRE", key, String(TTL_SECONDS)],
    ]),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`redis ${res.status}`);
  const out = (await res.json()) as Array<{ result?: number; error?: string }>;
  const n = out[0]?.result;
  if (typeof n !== "number") throw new Error(out[0]?.error || "redis bad reply");
  return n;
}

function memoryIncr(key: string): number {
  const day = today();
  const entry = memory.get(key);
  const count = (entry && entry.day === day ? entry.count : 0) + 1;
  memory.set(key, { day, count });
  if (memory.size > 50000) {
    for (const [k, v] of memory) if (v.day !== day) memory.delete(k);
  }
  return count;
}

async function incr(key: string): Promise<number> {
  if (REDIS_URL && REDIS_TOKEN) {
    try {
      return await redisIncr(key);
    } catch (error) {
      console.error("rate limit store unavailable, using memory", error instanceof Error ? error.message : error);
    }
  }
  return memoryIncr(key);
}

/** Counts one free generation for this visitor and reports whether it is allowed. */
export async function checkAndCount(visitor: string): Promise<Quota> {
  const limit = freeLimit();
  if (limit === 0) return { allowed: false, remaining: 0 };
  const day = today();

  const used = await incr(`mc:free:${day}:${visitor}`);
  if (used > limit) return { allowed: false, remaining: 0 };

  const cap = globalLimit();
  if (cap > 0) {
    const total = await incr(`mc:free:${day}:all`);
    if (total > cap) return { allowed: false, remaining: 0 };
  }
  return { allowed: true, remaining: limit - used };
}

/** A salted hash of the visitor's IP, so no raw IP address is ever used as a storage key. */
export function visitorId(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  const ip = (fwd ? fwd.split(",")[0] : headers.get("x-real-ip") || "unknown").trim();
  const salt = process.env.RATE_LIMIT_SALT || "mythical-creator";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}
