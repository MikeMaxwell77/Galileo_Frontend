import { Link } from "react-router-dom";
import SiteFooter from "../components/SiteFooter";

export default function PrivacyProtocol() {
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
          <span className="text-gradient">Privacy Protocol</span>
        </h1>
        <p className="legal-meta">Last updated April 2026</p>

        <div className="glass-panel legal-panel p-4 p-md-5 position-relative">
          <p>
            Galileo is a student-built astronomical event explorer and calendar created for CSCI 470/570 at the University of South Carolina Beaufort. This document explains what information we collect, how we use it, and the choices you have. Galileo is a non-commercial academic project, and we keep data collection to the minimum needed for the site to work.
          </p>

          <h2 className="font-headline legal-heading">1. What we collect</h2>
          <p>When you create an account or use Galileo, we may store:</p>
          <ul className="legal-list">
            <li><strong>Account information:</strong> username, email address, and a hashed password.</li>
            <li><strong>Profile settings:</strong> whether your profile is set to public or hidden, and any contact information you choose to add.</li>
            <li><strong>Location data:</strong> latitude, longitude, and elevation that you enter manually or share through your browser, used to compute event visibility.</li>
            <li><strong>Bookmarks and collections:</strong> the celestial events and objects you save, and how you organize them.</li>
            <li><strong>Session data:</strong> a session identifier used to keep you signed in.</li>
          </ul>
          <p>
            Guest users can browse the explore page and the public event calendar without an account. In that case we only handle location data for the duration of the page visit.
          </p>

          <h2 className="font-headline legal-heading">2. How we use your information</h2>
          <ul className="legal-list">
            <li>To show you which celestial events and objects are visible from your location.</li>
            <li>To save your bookmarks and bookmark collections between visits.</li>
            <li>To send event reminders and password reset emails (if you opt in to notifications).</li>
            <li>To let other users find your profile by username, only if your profile is public.</li>
            <li>To keep the service running and debug problems during development.</li>
          </ul>

          <h2 className="font-headline legal-heading">3. Third-party services</h2>
          <p>
            To display astronomical and weather information, Galileo passes location and query data to a small set of third-party APIs. We do not share your username, email, or password with any of them. The services we currently use are:
          </p>
          <ul className="legal-list">
            <li>U.S. National Weather Service API (weather.gov)</li>
            <li>Astronomy API (astronomyapi.com) for celestial events and body positions</li>
            <li>SIMBAD Astronomical Database (CDS Strasbourg) for object lookups</li>
            <li>WikiSky for the embedded sky map view</li>
            <li>Google Maps Elevation API for elevation lookups</li>
            <li>NASA APIs and NASA's Eyes on the Solar System for imagery and the embedded solar system viewer</li>
          </ul>
          <p>
            Each of these services has its own privacy policy, and we encourage you to review them if you are curious about how they handle requests.
          </p>

          <h2 className="font-headline legal-heading">4. Visibility and sharing</h2>
          <ul className="legal-list">
            <li>Your profile is private by default unless you choose to make it public.</li>
            <li>Public profiles can be found by username search and may show your public bookmark collections.</li>
            <li>You can hide or unhide your profile at any time from your account settings.</li>
            <li>Bookmarks and collections you mark as private are never shown to other users.</li>
          </ul>

          <h2 className="font-headline legal-heading">5. Your choices</h2>
          <ul className="legal-list">
            <li>Edit your information from your account settings page at any time.</li>
            <li>Reset your password through the password reset link on the login page.</li>
            <li>Hide your profile to remove yourself from username search.</li>
            <li>Delete your account to permanently remove your profile, bookmarks, and collections from our database.</li>
            <li>Turn off notifications by adjusting your account settings or by unsubscribing from any reminder email.</li>
          </ul>

          <h2 className="font-headline legal-heading">6. Data retention and security</h2>
          <p>
            We store data in a PostgreSQL database accessible only to the development team. Passwords are stored as one-way hashes, never in plain text. When you delete your account, your profile, bookmarks, and collections are removed from the active database. Because Galileo is a class project, we make no guarantees that the service will be maintained indefinitely; if the project is shut down, the database will be deleted.
          </p>

          <h2 className="font-headline legal-heading">7. Children</h2>
          <p>
            Galileo is not directed at children under 13, and we do not knowingly collect information from them. If you believe a child has created an account, please contact the team and we will remove it.
          </p>

          <h2 className="font-headline legal-heading">8. Contact</h2>
          <p>
            Galileo is built and maintained by Team 6: Michael Maxwell (group lead), Nathaniel Gosdin (frontend), and Daniel Scheer (backend). For privacy questions, please reach out through the contact link on the Galileo homepage.
          </p>

          <div className="card-corner-glow" />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
