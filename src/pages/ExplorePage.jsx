import { useState } from "react";

const SIGNALS = [
  { id: 1, icon: "rocket_launch", iconColor: "var(--clr-primary)", glowColor: "rgba(224,142,254,0.05)", title: "Stellar Documentation", desc: "A curated repository of technical specifications for warp drive maintenance and navigation.", tags: [{ label: "Archive", color: "var(--clr-secondary)", border: "rgba(186,146,250,0.2)" }, { label: "Active", color: "var(--clr-tertiary)", border: "rgba(255,231,146,0.2)" }], scanned: "0.4s ago", saved: true },
  { id: 2, icon: "database", iconColor: "var(--clr-secondary)", glowColor: "rgba(186,146,250,0.05)", title: "Nebula Core API", desc: "Connect your observation deck directly to the central nebula data stream for real-time tracking.", tags: [{ label: "Developer", color: "var(--clr-secondary)", border: "rgba(186,146,250,0.2)" }, { label: "API", color: "var(--clr-primary)", border: "rgba(224,142,254,0.2)" }], scanned: "1.2h ago", saved: false },
  { id: 3, icon: "public", iconColor: "var(--clr-primary)", glowColor: "rgba(224,142,254,0.05)", title: "Exoplanet Registry", desc: "Detailed biological and geological scans of newly discovered habitable worlds in the Goldilocks zone.", tags: [], scanned: "4h ago", saved: false },
  { id: 4, icon: "auto_awesome", iconColor: "var(--clr-secondary)", glowColor: "rgba(186,146,250,0.05)", title: "Quantum Frameworks", desc: "Next-gen code structures for simulating sub-atomic particle movements in high-density nebulae.", tags: [], scanned: "15m ago", saved: false },
];

const NAV_ITEMS = [
  { label: "Home",      icon: "space_dashboard", path: "/" },
  { label: "Explore",   icon: "explore",         path: "/explore", active: true },
  { label: "Calendar",  icon: "calendar_month",  path: "/calendar" },
  { label: "Bookmarks", icon: "bookmarks",       path: "/bookmarks" },
  { label: "Account",   icon: "person",          path: "/account" },
];

export default function ExplorePage() {
  const [bookmarks, setBookmarks] = useState({ 1: true });
  const [query, setQuery] = useState("");

  const toggleBookmark = (id) => setBookmarks((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="page-root">
      <nav className="top-nav">
        <div className="galileo-logo font-headline fw-bold fs-4">Galileo</div>
        <div className="d-none d-md-flex align-items-center gap-4">
          <a href="/"          className="nav-link-item">Home</a>
          <a href="/explore"   className="nav-link-item active">Explore</a>
          <a href="/calendar"  className="nav-link-item">Calendar</a>
          <a href="/bookmarks" className="nav-link-item">Bookmarks</a>
        </div>
        <div className="d-flex align-items-center gap-3">
          <button className="icon-btn"><span className="material-symbols-outlined">account_circle</span></button>
          <button className="btn-warp btn-warp-sm">Login</button>
        </div>
      </nav>

      <aside className="sidebar d-none d-lg-flex flex-column">
        <div className="sidebar-inner">
          <div className="galileo-logo font-headline fw-black mb-1">Galileo</div>
          <div className="sidebar-section-label">Navigation</div>
          <nav className="d-flex flex-column gap-1">
            {NAV_ITEMS.map((item) => (
              <a key={item.label} href={item.path} className={`sidebar-link ${item.active ? "active" : ""}`}>
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="sidebar-section-label mt-4">System</div>
          <nav className="d-flex flex-column gap-1">
            <a href="/settings" className="sidebar-link"><span className="material-symbols-outlined">settings</span>Settings</a>
            <a href="/support"  className="sidebar-link"><span className="material-symbols-outlined">help</span>Support</a>
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
              Explore the <span className="text-gradient">Void</span>
            </h1>
            <p className="page-subtitle">
              Scan the digital cosmos for bookmarks, data nodes, and celestial coordinates. Discover what others have charted in the infinite expanse.
            </p>
          </header>

          <div className="row g-3 mb-5">
            <div className="col-12 col-md-8">
              <div className="search-wrapper">
                <div className="search-box">
                  <span className="material-symbols-outlined search-icon">search</span>
                  <input className="search-input" type="text" placeholder="Search the nebula for websites, tags, or users..." value={query} onChange={(e) => setQuery(e.target.value)} />
                  <button className="btn-scan">SCAN</button>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <button className="share-btn">
                <span className="material-symbols-outlined">share_location</span>
                <span className="font-headline fw-bold">SHARE LOCATION</span>
              </button>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-baseline mb-4">
            <h2 className="font-headline fw-bold section-heading">Recent Signals</h2>
            <span className="results-count">3,241 bookmarks found</span>
          </div>

          <div className="row g-4">
            {SIGNALS.map((sig) => (
              <div key={sig.id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                <div className="signal-card h-100">
                  <div className="card-glow" style={{ background: sig.glowColor }} />
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <div className="card-icon-wrap">
                      <span className="material-symbols-outlined" style={{ color: sig.iconColor }}>{sig.icon}</span>
                    </div>
                    <button className={`bookmark-btn ${bookmarks[sig.id] ? "saved" : ""}`} onClick={() => toggleBookmark(sig.id)}>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: bookmarks[sig.id] ? "'FILL' 1" : "'FILL' 0" }}>bookmark</span>
                    </button>
                  </div>
                  <h3 className="font-headline fw-bold card-title">{sig.title}</h3>
                  <p className="card-desc">{sig.desc}</p>
                  {sig.tags.length > 0 && (
                    <div className="d-flex gap-2 mb-3">
                      {sig.tags.map((tag) => (
                        <span key={tag.label} className="tag-chip" style={{ color: tag.color, border: `1px solid ${tag.border}` }}>{tag.label}</span>
                      ))}
                    </div>
                  )}
                  <div className="d-flex justify-content-between align-items-center card-footer-row">
                    <span className="scan-time">Last Scanned: {sig.scanned}</span>
                    <a href="#" className="open-signal-link">OPEN SIGNAL <span className="material-symbols-outlined">arrow_forward</span></a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-center mt-5 pb-5">
            <button className="load-more-btn">
              SCAN FOR MORE SIGNALS
              <span className="material-symbols-outlined">expand_more</span>
            </button>
          </div>
        </div>
      </main>

      <div className="mobile-nav-bar d-lg-none">
        <button className="mobile-nav-btn"><span className="material-symbols-outlined">space_dashboard</span></button>
        <button className="mobile-nav-btn active"><span className="material-symbols-outlined">explore</span></button>
        <button className="mobile-nav-btn"><span className="material-symbols-outlined">calendar_month</span></button>
        <button className="mobile-nav-btn"><span className="material-symbols-outlined">bookmarks</span></button>
      </div>
    </div>
  );
}