export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").replace(/\/+$/, "");
export const SITE_NAME = "The Mythical Creator";
export const SITE_TAGLINE = "Nobody Gets Forgotten";
export const SITE_DESCRIPTION =
  "Turn the real stories of the people you love into song lyrics, lead sheets, short stories, poems, and a printable legacy book, with AI that stays true to your memories.";
export const CREATOR = "Billy Adono Robles";
export const absoluteUrl = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";
export const LEGAL_UPDATED = "November 11, 2026";
