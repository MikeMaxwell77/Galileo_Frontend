import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationService from "../auth/AuthenticationService";

/* NASA APOD — disabled for now, re-enable when ready
const COLLECTION_META = [
  { title: "Interstellar Physics", subtitle: "12 Transmissions • Science Archive", overlayColor: "rgba(224,142,254,0.2)", titleHoverColor: "var(--clr-primary)" },
  { title: "Aesthetic Archetypes", subtitle: "28 Transmissions • Design Research", overlayColor: "rgba(186,146,250,0.2)", titleHoverColor: "var(--clr-secondary)" },
];
*/

const NAV_ITEMS = [
  { label: "Home", icon: "space_dashboard", path: "/home", active: true },
  { label: "Explore", icon: "explore", path: "/explore" },
  { label: "Calendar", icon: "calendar_month", path: "/calendar" },
  { label: "Bookmarks", icon: "bookmarks", path: "/bookmarks" },
  { label: "Account", icon: "person", path: "/account" },
];


/* NASA APOD fetch — disabled for now, re-enable when ready
  const [apodImgs, setApodImgs] = useState([]);
  useEffect(() => {
    const key = import.meta.env.VITE_NASA_API_KEY ?? "DEMO_KEY";
    fetch(`https://api.nasa.gov/planetary/apod?api_key=${key}&count=8`)
      .then(r => r.json())
      .then(data => {
        const images = data.filter(d => d.media_type === "image").map(d => d.url);
        if (images.length >= 4) setApodImgs(images);
      })
      .catch(() => {});
  }, []);
  const collections = COLLECTION_META.map((col, i) => ({
    ...col,
    imgs: [apodImgs[i * 2], apodImgs[i * 2 + 1]],
  }));
*/

export default function HomePage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(AuthenticationService.isAuthenticated());
  }, []);

  return (
    <div className="page-root">
      <div className="nebula-glow-bg" />
      <div className="orb-tr" />
      <div className="orb-bl" />

      <nav className="top-nav">
        <div className="galileo-logo font-headline fw-bold fs-4">Galileo</div>
        <div className="d-none d-md-flex align-items-center gap-4">
          <Link to="/home" className="nav-link-item active">Home</Link>
          <Link to="/explore" className="nav-link-item">Explore</Link>
          <Link to="/calendar" className="nav-link-item">Calendar</Link>
          <Link to="/bookmarks" className="nav-link-item">Bookmarks</Link>
        </div>
        <div className="d-flex align-items-center gap-3">
          {!isAuthenticated && <button className="btn-warp btn-warp-sm" onClick={() => navigate("/login")}>Login</button>}
          <button className="icon-btn"><span className="material-symbols-outlined">account_circle</span></button>
        </div>
      </nav>

      <aside className="sidebar d-none d-lg-flex flex-column">
        <div className="sidebar-inner">
          <div className="galileo-logo font-headline fw-black mb-1">Galileo</div>
          <div className="sidebar-section-label">Navigation</div>
          <nav className="d-flex flex-column gap-1">
            {NAV_ITEMS.map((item) => (
              <Link key={item.label} to={item.path} className={`sidebar-link ${item.active ? "active" : ""}`}>
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="sidebar-footer">
          <button className="sidebar-new-obs-btn">New Observation</button>
        </div>
      </aside>

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
            <div className="guide-section-decor">
              <span className="material-symbols-outlined">satellite</span>
            </div>
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
