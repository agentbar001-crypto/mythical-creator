import type { Metadata } from "next";
import { CONTACT_EMAIL, LEGAL_UPDATED, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms for using The Mythical Creator studio, including ownership of your stories and AI-generated content.",
  alternates: { canonical: absoluteUrl("/terms") },
};

export default function Terms() {
  return (
    <main className="prose">
      <h1>Terms of Use</h1>
      <p><em>Last updated {LEGAL_UPDATED}</em></p>

      <h2>Using the Studio</h2>
      <p>You may use The Mythical Creator to record stories and create songs, stories, poems, lead sheets, and books from them. Don&apos;t use it to harass, defame, or invade the privacy of anyone, or to create unlawful content.</p>

      <h2>Your content</h2>
      <p>You own the memories and text you write. As between you and us, you also own the lyrics, stories, poems, and other material the Studio generates for you, to the extent the law allows. You&apos;re responsible for having the right to share the stories you record, and for checking AI-generated content before you publish or perform it.</p>

      <h2>AI-generated content</h2>
      <p>AI output can be inaccurate, can resemble existing works, or can describe real people in ways they wouldn&apos;t. Review and edit it before use. When you use third-party tools such as Suno or Udio, their terms apply to what you make there.</p>

      <h2>Free samples and your own key</h2>
      <p>Free AI sample generations are limited and may change or stop at any time. If you use your own Anthropic key, Anthropic bills you directly under its terms, and you&apos;re responsible for that usage.</p>

      <h2>Backups and availability</h2>
      <p>Your work is stored in your browser. We aren&apos;t responsible for data lost when browser storage is cleared, so export backups regularly. The service is provided &quot;as is&quot; without warranties, and to the extent the law allows, our liability is limited to the amount you paid us in the last 12 months.</p>

      <h2>The Mythical Creator system</h2>
      <p>The Mythical Creator, Legacy Builder™, and the system&apos;s framework of wounds, gifts, archetypes, and arcs were created by Billy Adono Robles. The app&apos;s design, code, and framework remain his property.</p>

      <h2>Changes</h2>
      <p>We may update these terms; the date above shows the latest version. {CONTACT_EMAIL ? <>Questions: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</> : null}</p>
    </main>
  );
}
