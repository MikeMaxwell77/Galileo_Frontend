import { Link } from "react-router-dom";
import SiteFooter from "../components/SiteFooter";

export default function TermsOfOrbit() {
  return (
    <div className="bg-nebula legal-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="glow-orb-left" />
      <div className="glow-orb-right" />

      <header className="position-fixed top-0 w-100 d-flex justify-content-between align-items-center px-3 px-md-4 py-3 py-md-4" style={{ zIndex: 1 }}>
        <Link to="/" className="font-headline fw-bold fs-4 galileo-logo text-decoration-none">Galileo</Link>
      </header>

      <main className="container py-5 legal-main" style={{ maxWidth: "880px", marginTop: "5rem" }}>
        <span className="font-headline fw-bold section-eyebrow">Project Galileo</span>
        <h1 className="font-headline fw-bold hero-heading mb-3">
          <span className="text-gradient">Terms of Orbit</span>
        </h1>
        <p className="legal-meta">The friendly fine print — Last updated April 2026</p>

        <div className="glass-panel legal-panel p-4 p-md-5 position-relative">
          <p>
            Welcome to Galileo. These Terms of Orbit describe the simple rules for using the site. By creating an account or browsing as a guest, you agree to keep things in good orbit alongside us. Galileo is a student-built academic project, not a commercial service, and these terms are written in that spirit.
          </p>

          <h2 className="font-headline legal-heading">1. Who can use Galileo</h2>
          <ul className="legal-list">
            <li>Anyone 13 or older may browse the public pages and create an account.</li>
            <li>You agree to provide accurate information when registering and to keep your login credentials reasonably secure.</li>
            <li>You are responsible for activity that happens under your account.</li>
          </ul>

          <h2 className="font-headline legal-heading">2. Acceptable use</h2>
          <p>Please use Galileo for its intended purpose: exploring the night sky. Do not:</p>
          <ul className="legal-list">
            <li>Try to break, scrape at scale, or overload the site or its underlying APIs.</li>
            <li>Use the site to harass, impersonate, or share private information about other users.</li>
            <li>Upload illegal, harmful, or sexually explicit content into bookmark notes, profile fields, or anywhere else on the site.</li>
            <li>Bypass the visibility settings of another user's profile or collections.</li>
          </ul>
          <p>
            We may suspend or remove accounts that violate these rules. Because Galileo is a class project, moderation is best-effort and informal.
          </p>

          <h2 className="font-headline legal-heading">3. Your content</h2>
          <p>
            You keep ownership of the bookmarks, collection names, and notes you create. By marking a collection as public, you grant other Galileo users the ability to view and reference it. You can change a collection back to private or delete it at any time.
          </p>

          <h2 className="font-headline legal-heading">4. Astronomical data and accuracy</h2>
          <p>
            Galileo pulls celestial data from third-party APIs and applies its own visibility algorithm based on the location you provide. We do our best to be accurate, but:
          </p>
          <ul className="legal-list">
            <li>Visibility predictions are estimates based on a simplified model.</li>
            <li>Weather conditions, light pollution, and equipment will affect what you actually see.</li>
            <li>Third-party data sources can be incomplete, delayed, or temporarily unavailable.</li>
            <li>Galileo should not be used as the sole reference for time-critical or safety-critical observations.</li>
          </ul>

          <h2 className="font-headline legal-heading">5. Third-party services</h2>
          <p>
            Galileo depends on several external services, including weather.gov, the Astronomy API, SIMBAD, WikiSky, NASA APIs and NASA's Eyes on the Solar System, and the Google Maps Elevation API. Your use of those services through Galileo is also subject to their own terms. If any of them changes its terms or stops being available, parts of Galileo may stop working.
          </p>

          <h2 className="font-headline legal-heading">6. Account suspension and deletion</h2>
          <ul className="legal-list">
            <li>You may delete your account at any time from your account settings.</li>
            <li>We may suspend or remove accounts that abuse the service or violate these terms.</li>
            <li>If the project is retired at the end of the course or afterward, accounts and data may be permanently deleted.</li>
          </ul>

          <h2 className="font-headline legal-heading">7. No warranty</h2>
          <p>
            Galileo is provided "as is," for educational and personal use. The team makes no warranties about uptime, accuracy, or fitness for any particular purpose. Use the site at your own risk.
          </p>

          <h2 className="font-headline legal-heading">8. Limitation of liability</h2>
          <p>
            To the fullest extent allowed by law, the Galileo team and contributors are not liable for any indirect, incidental, or consequential losses arising from your use of the site, including missed observations or decisions made based on the data shown.
          </p>

          <h2 className="font-headline legal-heading">9. Changes to these terms</h2>
          <p>
            We may update these Terms of Orbit as the project evolves through Sprints and beyond. The latest version will always be linked from the Galileo footer. Continued use of the site after an update means you accept the revised terms.
          </p>

          <h2 className="font-headline legal-heading">10. Contact</h2>
          <p>
            Questions or concerns about these terms? Reach out to Team 6 through the contact link on the Galileo homepage.
          </p>

          <div className="card-corner-glow" />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
