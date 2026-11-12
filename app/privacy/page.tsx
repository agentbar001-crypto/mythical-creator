import type { Metadata } from "next";
import { CONTACT_EMAIL, LEGAL_UPDATED, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How The Mythical Creator handles your stories, characters, and AI requests. Your data stays in your browser by default.",
  alternates: { canonical: absoluteUrl("/privacy") },
};

export default function Privacy() {
  return (
    <main className="prose">
      <h1>Privacy Policy</h1>
      <p><em>Last updated {LEGAL_UPDATED}</em></p>

      <h2>The short version</h2>
      <ul>
        <li>Your characters, memories, lyrics, and settings are stored in your own browser on your device. We don&apos;t have a copy.</li>
        <li>When you press an AI button, the character you&apos;re working on is sent through our server to Anthropic&apos;s Claude to write that piece. We don&apos;t store it.</li>
        <li>We don&apos;t sell your data, run ads, or use tracking cookies.</li>
      </ul>

      <h2>What stays on your device</h2>
      <p>The Studio saves your work in your browser&apos;s local storage. Clearing your browser data, using a private window, or switching devices will remove it, so use <strong>Export Backup</strong> in the Legacy Vault to keep a copy. <strong>Erase all data on this device</strong> deletes it immediately.</p>

      <h2>AI requests</h2>
      <p>AI writing is optional. In offline mode nothing leaves your device. When Claude AI is on and you press an AI button, we send the active character&apos;s name, nickname, place, role, archetype, telling voice, summary, memory, tags, arc, genre, song title, and lyrics to Anthropic, PBC to generate the result, which streams back to your browser. Our server processes the request in memory and does not log or keep its content. Anthropic handles API data under its own commercial terms and privacy policy, which say API inputs and outputs are not used to train its models by default.</p>

      <h2>Your own API key</h2>
      <p>If you add your own Anthropic key, it is sent with each AI request so the request runs on your Anthropic account. Our server uses it only for that request and never stores it. In your browser it is kept for the current tab only, unless you tick &quot;Remember my key on this device&quot;, which saves it in local storage on that device.</p>

      <h2>Information we do process</h2>
      <p>To limit free sample generations, our server counts requests per IP address per day, in memory, and discards the count daily. Our hosting provider may keep standard technical logs (such as IP address, time, and page requested) for security and reliability.</p>

      <h2>Stories about other people</h2>
      <p>You&apos;re responsible for what you write. If you record the story of a living person, please make sure they&apos;re comfortable with it, especially before sharing or publishing.</p>

      <h2>Children</h2>
      <p>The Mythical Creator is not directed at children under 13, and we don&apos;t knowingly collect personal information from them.</p>

      <h2>Your rights</h2>
      <p>Because your content stays on your device, you can view, export, correct, or delete it yourself at any time. Depending on where you live (for example under the GDPR or the CCPA/CPRA), you may have rights to access or delete personal information we hold; since we don&apos;t store your content, that is usually limited to technical logs. {CONTACT_EMAIL ? <>Contact us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</> : null}</p>

      <h2>Changes</h2>
      <p>If this policy changes, we&apos;ll update the date above. Material changes, such as adding accounts or payments, will be announced in the app.</p>
    </main>
  );
}
