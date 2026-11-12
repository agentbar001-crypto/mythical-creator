import type { Metadata } from "next";
import { CREATOR, SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/") },
};

const FAQ = [
  {
    q: "What is The Mythical Creator?",
    a: "A free studio for turning the real stories of people you love into song lyrics, Suno-ready style prompts, engraved lead sheets, short stories, poems, and a printable legacy book. You add your own characters and memories; nothing is pre-written.",
  },
  {
    q: "Do I need an account or an AI key?",
    a: "No. The built-in offline engine works with no account. Claude AI writing comes with free sample generations each day, and you can add your own Anthropic key for unlimited use. Subscriptions are coming soon.",
  },
  {
    q: "Where are my stories stored?",
    a: "In your own browser, on your device. Nothing is uploaded unless you press an AI button, and then only the active character is sent to write that piece. You can export a backup file at any time.",
  },
  {
    q: "Can I use the songs with Suno or Udio?",
    a: "Yes. Each character gets complete lyrics with section tags and a style prompt you can copy straight into Suno, Udio, or a studio session.",
  },
  {
    q: "Does the AI make things up about my family?",
    a: "It is instructed to stay true to the facts in your memory and never invent names, places, or events. It adds imagery and emotion, and you can edit every word.",
  },
];

export default function Home() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Any (web browser)",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      creator: { "@type": "Person", name: CREATOR },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <section className="hero">
        <div className="wrap">
          <div className="kicker">Nobody Gets Forgotten</div>
          <h1>Turn the real stories of the people you love into songs, stories, and a legacy book</h1>
          <p>
            Write down a memory of a parent, a grandparent, a neighbor, or yourself. The Mythical Creator finds the wound and the gift inside it,
            shapes an emotional arc, and helps you build song lyrics, a lead sheet, a short story, a poem, and a printable book that keeps them alive.
          </p>
          <div className="cta-row">
            <a className="btn btn-primary" href="/studio">Create your first character, free</a>
            <a className="btn btn-ghost" href="#how-it-works">See how it works</a>
          </div>
        </div>
      </section>

      <section className="block" id="how-it-works">
        <div className="wrap">
          <h2>How it works</h2>
          <ol className="steps">
            <li><strong>Add a character.</strong> A real person whose story deserves to last, with their place, role, and the symbols tied to them.</li>
            <li><strong>Capture a memory.</strong> Write it the way you&apos;d tell it out loud. It saves as you type, on your own device.</li>
            <li><strong>Extract the myth.</strong> One click tags the wounds, gifts, symbols, and emotional arc (Loss → Fight → Rise, Love → Loss → Legacy, and more).</li>
            <li><strong>Create in any medium.</strong> Song lyrics and a Suno style prompt, an engraved lead sheet you can play back, a short story, or a poem, written by Claude AI or the offline engine.</li>
            <li><strong>Publish the legacy.</strong> Connect your characters into a family and community graph and compile everything into a printable book.</li>
          </ol>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <h2>Everything you can make from one memory</h2>
          <div className="grid">
            <div className="card"><h3>Song lyrics & Suno prompts</h3><p>Verse, chorus, bridge, and outro grounded in the real story, plus a style prompt ready for Suno or Udio.</p></div>
            <div className="card"><h3>Engraved lead sheets</h3><p>Melody, chords, and lyric words on a staff in six genres, from bolero and salsa to blues, hip-hop, soul, and folk, with audio playback.</p></div>
            <div className="card"><h3>Short stories & poems</h3><p>A memorial poem or a literary short story in the voice you choose: the family, the elder, the child, the witness.</p></div>
            <div className="card"><h3>A printable legacy book</h3><p>Your people register, their memories, a symbol glossary, and a musical catalog, ready to print or save as PDF.</p></div>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <h2>Private by design</h2>
          <p>
            Your characters and memories live in your browser, not on our servers. AI writing sends only the character you&apos;re working on, only when you ask,
            and the app doesn&apos;t keep it. Export a backup whenever you like. Read the <a href="/privacy">privacy policy</a>.
          </p>
        </div>
      </section>

      <section className="block" id="faq">
        <div className="wrap">
          <h2>Frequently asked questions</h2>
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
          <div className="cta-row">
            <a className="btn btn-primary" href="/studio">Open the Studio</a>
          </div>
        </div>
      </section>
    </main>
  );
}
