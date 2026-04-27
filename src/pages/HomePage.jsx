import Navbar from "../components/Navbar";
import saturnImg from "../assets/saturn.jpg";
import "./BookmarkPage.css";

export default function HomePage() {
  return (
    <div className="page-root planet-bg-root">
      <div
        className="planet-bg"
        style={{ backgroundImage: `url(${saturnImg})` }}
      />
      <div className="planet-bg-fade" />

      <Navbar active="home" />

      <main className="page-main">
        <div className="page-content">

          <header className="mb-5">
            <h1 className="font-headline fw-bold page-title">
              Map the <span className="text-gradient">Digital Void.</span>
            </h1>
            <p className="page-subtitle">
              Organize the cosmic chaos of the web. Save, curate, and explore a universe of bookmarks tailored for the modern intellectual explorer.
            </p>
          </header>

          <section className="mb-5 glass-card guide-section">
            <div className="guide-inner">
              <span className="section-eyebrow" style={{ color: "var(--clr-tertiary)", display: "block", marginBottom: "0.75rem" }}>About Galileo</span>
              <h2 className="font-headline fw-bold guide-heading">Your Window to the Cosmos</h2>
              <p style={{ color: "var(--clr-on-surface-variant)", lineHeight: 1.8, fontSize: "1rem", marginBottom: "1.5rem" }}>
                Galileo is your personal celestial observatory — a platform built for sky-watchers, astronomers, and curious minds who want to track the universe's movements in real time.
              </p>
              <p style={{ color: "var(--clr-on-surface-variant)", lineHeight: 1.8, fontSize: "1rem", marginBottom: "1.5rem" }}>
                Explore active satellites in the deep-sky view, check daily sunrise, sunset, and moon phase data on the Calendar, and save your observations as bookmarks for future reference.
              </p>
              <p style={{ color: "var(--clr-on-surface-variant)", lineHeight: 1.8, fontSize: "1rem", marginBottom: 0 }}>
                Powered by real-time astronomical data and location-based forecasting, Galileo keeps you connected to the cosmos — wherever you are on this pale blue dot.
              </p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
