import { useState, useEffect } from "react";

const BOOKMARKS = [
  { icon: "database", iconBg: "rgba(186,146,250,0.1)", iconColor: "var(--clr-secondary)", title: "AI Model Archive 2024",  desc: "The largest curated collection of open-source LLMs and training datasets for cosmic simulation.", tag: "Science / AI" },
  { icon: "palette",  iconBg: "rgba(255,231,146,0.1)", iconColor: "var(--clr-tertiary)",  title: "Nebula Design Assets",   desc: "High-resolution procedural texture maps for celestial rendering and UI backgrounds.", tag: "Design / Assets" },
  { icon: "public",   iconBg: "rgba(224,142,254,0.1)", iconColor: "var(--clr-primary)",   title: "Planetary Governance",   desc: "Whitepaper discussing legal frameworks for sustainable lunar and martian colonies.", tag: "Legal / Space" },
];

const COLLECTION_META = [
  { title: "Interstellar Physics", subtitle: "12 Transmissions • Science Archive", overlayColor: "rgba(224,142,254,0.2)", titleHoverColor: "var(--clr-primary)" },
  { title: "Aesthetic Archetypes", subtitle: "28 Transmissions • Design Research", overlayColor: "rgba(186,146,250,0.2)", titleHoverColor: "var(--clr-secondary)" },
];

const GUIDE_STEPS = [
  { num: "01", cls: "step-primary",   title: "Capture the Signal",     desc: "Use our browser extension or the 'New Observation' console to save any web transmission. Galileo automatically parses metadata and creates a visual fingerprint of the link." },
  { num: "02", cls: "step-secondary", title: "Form Galactic Clusters",  desc: "Don't just save links — contextualize them. Group related transmissions into Collections. Add notes, research goals, and keep your data organized." },
  { num: "03", cls: "step-tertiary",  title: "Private Archives",        desc: "All your transmissions are end-to-end encrypted and visible only to you. You maintain full sovereignty over your digital research and bookmarks." },
];

const NAV_ITEMS = [
  { label: "Home",      icon: "space_dashboard", path: "/",          active: true },
  { label: "Explore",   icon: "explore",         path: "/explore" },
  { label: "Calendar",  icon: "calendar_month",  path: "/calendar" },
  { label: "Bookmarks", icon: "bookmarks",       path: "/bookmarks" },
  { label: "Account",   icon: "person",          path: "/account" },
];

const FALLBACK_IMGS = [
  "https://apod.nasa.gov/apod/image/2501/Horsehead_Webb_960.jpg",
  "https://apod.nasa.gov/apod/image/2501/NGC1232_ESO_960.jpg",
  "https://apod.nasa.gov/apod/image/2501/M31_HubbleSubaru_960.jpg",
  "https://apod.nasa.gov/apod/image/2501/OrionNebula_Webb_960.jpg",
];

export default function HomePage() {
  const [apodImgs, setApodImgs] = useState(FALLBACK_IMGS);

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
    imgs: [apodImgs[i * 2] ?? FALLBACK_IMGS[i * 2], apodImgs[i * 2 + 1] ?? FALLBACK_IMGS[i * 2 + 1]],
  }));

  return (
    <div className="page-root">
      <div className="nebula-glow-bg" />
      <div className="orb-tr" />
      <div className="orb-bl" />

      <nav className="top-nav">
        <div className="d-flex align-items-center gap-4">
          <span className="galileo-logo font-headline fw-bold fs-4">Galileo</span>
          <div className="d-none d-md-flex align-items-center gap-4">
            <a href="/"          className="nav-link-item active">Home</a>
            <a href="/explore"   className="nav-link-item">Explore</a>
            <a href="/calendar"  className="nav-link-item">Calendar</a>
            <a href="/bookmarks" className="nav-link-item">Bookmarks</a>
          </div>
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
          <button className="btn-warp d-flex align-items-center justify-content-center gap-2 mt-4"
            style={{ width: "100%", borderRadius: "0.75rem", padding: "0.75rem", fontSize: "0.75rem" }}>
            New Observation
          </button>
        </div>
        <div className="sidebar-footer d-flex flex-column gap-1" style={{ borderTop: "1px solid rgba(72,71,74,0.15)" }}>
          <a href="/settings" className="sidebar-link"><span className="material-symbols-outlined">settings</span>Settings</a>
          <a href="/support"  className="sidebar-link"><span className="material-symbols-outlined">help</span>Support</a>
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

          <section className="mb-5">
            <div className="d-flex justify-content-between align-items-end mb-4">
              <div>
                <span className="section-eyebrow" style={{ color: "var(--clr-tertiary)" }}>Your Observatory</span>
                <h2 className="font-headline fw-bold section-heading mb-0">Stored Bookmarks</h2>
              </div>
              <button className="manage-btn">
                Manage All Transmissions
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
            <div className="row g-4">
              {BOOKMARKS.map((bm) => (
                <div key={bm.title} className="col-12 col-md-6 col-lg-4">
                  <div className="glass-card bookmark-card h-100">
                    <div>
                      <div className="bookmark-icon-wrap" style={{ background: bm.iconBg }}>
                        <span className="material-symbols-outlined" style={{ color: bm.iconColor }}>{bm.icon}</span>
                      </div>
                      <h3 className="font-headline fw-bold card-title">{bm.title}</h3>
                      <p className="card-desc">{bm.desc}</p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-4">
                      <span className="card-tag">{bm.tag}</span>
                      <span className="material-symbols-outlined card-ext-icon">open_in_new</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-5">
            <div className="mb-4">
              <span className="section-eyebrow" style={{ color: "var(--clr-secondary)" }}>Archives</span>
              <h2 className="font-headline fw-bold section-heading mb-0">Bookmark Collections</h2>
            </div>
            <div className="row g-4">
              {collections.map((col) => (
                <div key={col.title} className="col-12 col-md-6">
                  <div className="glass-card collection-card">
                    <div className="collection-img-wrap">
                      <div className="collection-img-grid">
                        {col.imgs.map((src, i) => <img key={i} src={src} alt="" />)}
                      </div>
                      <div className="collection-overlay" style={{ background: col.overlayColor }}>
                        <button className="collection-open-btn">Open Collection</button>
                      </div>
                    </div>
                    <h4 className="font-headline fw-bold collection-title" style={{ "--hover-color": col.titleHoverColor }}>{col.title}</h4>
                    <p className="collection-subtitle">{col.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-5 glass-card guide-section">
            <div className="guide-section-decor">
              <span className="material-symbols-outlined">satellite</span>
            </div>
            <div className="guide-inner">
              <span className="section-eyebrow" style={{ color: "var(--clr-tertiary)", display: "block", marginBottom: "0.75rem" }}>Navigation Manual</span>
              <h2 className="font-headline fw-bold guide-heading">Master the Observatory</h2>
              <div className="d-flex flex-column gap-5">
                {GUIDE_STEPS.map((step) => (
                  <div key={step.num} className="guide-step">
                    <div className={`guide-step-num ${step.cls}`}>{step.num}</div>
                    <div>
                      <h3 className="font-headline fw-bold guide-step-title">{step.title}</h3>
                      <p className="guide-step-desc">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="onboard-btn">
                Launch Onboarding Protocol
                <span className="material-symbols-outlined">rocket_launch</span>
              </button>
            </div>
          </section>

        </div>

        <footer className="home-footer">
          <div className="home-footer-inner d-flex flex-column flex-md-row justify-content-between align-items-center gap-4">
            <div>
              <span className="galileo-logo font-headline fw-bold fs-4">Galileo</span>
              <p className="footer-copy">© 2024 Cosmic Research Systems. All rights reserved.</p>
            </div>
            <div className="d-flex gap-4">
              <a href="#" className="footer-link">Protocol</a>
              <a href="#" className="footer-link">Privacy</a>
              <a href="#" className="footer-link">Terminal</a>
              <a href="#" className="footer-link">Signal Support</a>
            </div>
            <div className="d-flex gap-3">
              <button className="footer-icon-btn"><span className="material-symbols-outlined">public</span></button>
              <button className="footer-icon-btn"><span className="material-symbols-outlined">terminal</span></button>
            </div>
          </div>
        </footer>
      </main>

      <button className="fab-add-btn">
        <span className="material-symbols-outlined">add</span>
      </button>
    </div>
  );
}
