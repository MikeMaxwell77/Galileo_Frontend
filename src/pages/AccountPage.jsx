import { useState } from "react";

const OBSERVERS = [
  { handle: "@orion_9",     src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDMcqcfY0SVxutOYgf1WcI-zjup3MwZLq9Lq8C5WQ4Aly46jrtTz4OBwOTuGcef-jvOeUUq7LXbBdys129jSfps55B4VRnc1VipbvFE6BrPAyt8_eK3NrV36WfafllZ5J5Z-_ceekn69oEMt8UUiiA7_X23Ft18avPm1gNAvoflujnbIWvqZu0nNpNfm4Cm1PikxZao65SUnI4ioctrfg92-dmrrDjh2NFpSPrYIedlKpPr9ACmBCkO8H_hfbGv9qC9i6noq1Mx158" },
  { handle: "@nova_flux",   src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD03CFtNbgq8Swzfpcf44hSerwcYbZYvASdtfEWe3RhawQw42TLTd6TQd9_rYfzFjM6U8fo9dN73WRIs4SkS7WS6Ugnb2Qn8sptZHaegr-JQL-hVfm9qTCqgluvj6UOdIW_nUgMAgptKSVTOqStH6nBDM_PS3YUkLp9yXSsCHu7YNZAMIvjRj3YO_SzkeDDy-eAo07ex6f0tsitxERuUXfXfbmhb3NL-34rxMZ9D-G2gwwz6US_J17hQWYz2B_YdDbWxh7UDSk6hTo" },
  { handle: "@atlas_prime", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvCukNw4CPB9ypH09bt6TOR98TTQrOvf8Te1GYSbBsiTkpzJ0eFIkKTA4aYEydiHepEZ3_Z7K-gQzDHwJIQ4akh5Y8oL1ZEGj7jtYtLr6tPZJb6sb5O3I3rlo2sUvbcGZqNg5dzrR0hSw3_Nw_uN25e2G3WawJh78xUcpMAbN6KhhKwT9ZQ8NLEHJ6T09Jhc3oMUJFwFJnC43LqePDvV06PZfAguq1_5COWlFcIgmxLxTDqIESU3-DmQSaZYa8GN6cG9DnbChEkYo" },
  { handle: "@stella_v",    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuByGxdFT4EfeIJoTEin1caBofabJ3lvg-oP7xt2ltoAzShYouGWtRc1yES_l45GXOJcqMaR_kWMOFxcGQ3awZROr5Eb_YJ7xbxTKLrle1s6U719KDibcgQx3O1TwGna8-Zlm8C-5QS3hvHGJ96Lq9qiIW59x24NbO8XEgxlDIrmeCIXT8CZzGskfuKDyDyndBgoemUNo8oDwq9ppybwwoeTNlDeKqcUAu9MzeIGdlbEjidkZWnHjGCXeUup2ihT7drijcFpSNaVu-k" },
];

const SETTINGS_PANELS = [
  { icon: "notifications", iconBg: "rgba(224,142,254,0.1)", iconColor: "var(--clr-primary)",            title: "Communication",   desc: "Frequency and priority of signal alerts." },
  { icon: "palette",       iconBg: "rgba(186,146,250,0.1)", iconColor: "var(--clr-secondary)",          title: "Interface Aura",  desc: "Theme, accents, and visual density controls." },
  { icon: "database",      iconBg: "rgba(255,231,146,0.1)", iconColor: "var(--clr-tertiary)",           title: "Data Core",       desc: "Storage allocation and backup protocols." },
  { icon: "language",      iconBg: "rgba(173,170,173,0.1)", iconColor: "var(--clr-on-surface-variant)", title: "Regional Nodes",  desc: "Language, timezone, and local servers." },
];

const NAV_ITEMS = [
  { label: "Home",      icon: "space_dashboard", path: "/" },
  { label: "Explore",   icon: "explore",         path: "/explore" },
  { label: "Calendar",  icon: "calendar_month",  path: "/calendar" },
  { label: "Bookmarks", icon: "bookmarks",       path: "/bookmarks" },
  { label: "Account",   icon: "person",          path: "/account", active: true },
];

export default function AccountPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="page-root">
      <nav className="top-nav">
        <div className="d-flex align-items-center gap-4">
          <span className="galileo-logo font-headline fw-bold fs-4">Galileo</span>
          <div className="d-none d-md-flex align-items-center gap-4">
            <a href="/"          className="nav-link-item">Home</a>
            <a href="/explore"   className="nav-link-item">Explore</a>
            <a href="/calendar"  className="nav-link-item">Calendar</a>
            <a href="/bookmarks" className="nav-link-item">Bookmarks</a>
          </div>
        </div>
        <div className="d-flex align-items-center gap-3">
          <div className="d-none d-sm-block position-relative">
            <input className="galileo-input form-control" style={{ borderRadius: "999px", paddingRight: "2.5rem", width: "220px" }} type="text" placeholder="Search cosmos..." />
            <span className="material-symbols-outlined" style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--clr-on-surface-variant)", fontSize: "1.1rem", pointerEvents: "none" }}>search</span>
          </div>
          <button className="icon-btn"><span className="material-symbols-outlined">account_circle</span></button>
        </div>
      </nav>

      <aside className="sidebar d-none d-lg-flex flex-column">
        <div className="sidebar-inner">
          <div className="sidebar-section-label" style={{ color: "var(--clr-primary)" }}>Main Deck</div>
          <nav className="d-flex flex-column gap-1">
            {NAV_ITEMS.map((item) => (
              <a key={item.label} href={item.path} className={`sidebar-link ${item.active ? "active" : ""}`}>
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
              </a>
            ))}
          </nav>
          <button className="btn-warp d-flex align-items-center justify-content-center gap-2 mt-4" style={{ width: "100%", borderRadius: "0.75rem", padding: "0.75rem", fontSize: "0.75rem" }}>
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
            <h1 className="font-headline fw-bold page-title mb-1">Command Center</h1>
            <p className="page-subtitle mb-0">Manage your cosmic identity and system preferences.</p>
          </header>

          <div className="row g-4">

            <div className="col-12 col-md-8">
              <div className="bento-card d-flex flex-column flex-md-row align-items-center gap-4">
                <div className="profile-avatar">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6qUDN6vQwCQu_rTE7FlDpVzbn2Mt2oySBte7ZKItPhyI3mIRTogNVcQsK8970wshqHLFurIbBKYSgC2F1sDyfMglqt_5M2tRLW9g1XI6UvmZ0jtK22Tm0jKWDpvFtaM1pGdWsd3dtNP-B1xziozAgw8HAh08YQV1oxCcs7_MW5BeKCRvS0wxsshWGwFD31E9ExDsI9G1d9aTcpvAPG1qa5P1c-1kJia0DhAx-1j9lW_bYIdhVrR04mvyRn6lKGHHGAD-HFzTvJdE" alt="User Profile" />
                  <button className="avatar-edit-btn"><span className="material-symbols-outlined">edit</span></button>
                </div>
                <div className="flex-grow-1 text-center text-md-start">
                  <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-2 mb-2">
                    <h2 className="font-headline fw-bold mb-0" style={{ fontSize: "1.75rem" }}>Lyra Vance</h2>
                    <span className="badge-chip">Elite Observer</span>
                  </div>
                  <p className="profile-meta">lyra.vance@galileo.io • Joined Sol 2042</p>
                  <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-2">
                    <span className="stat-chip" style={{ color: "var(--clr-secondary)" }}>
                      <span className="stat-dot" style={{ background: "var(--clr-secondary)" }} />
                      1,248 Bookmarks
                    </span>
                    <span className="stat-chip" style={{ color: "var(--clr-primary)" }}>
                      <span className="stat-dot" style={{ background: "var(--clr-primary)" }} />
                      42 Shared Clusters
                    </span>
                  </div>
                </div>
                <div className="profile-orb" />
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="bento-card-high h-100 d-flex flex-column justify-content-between">
                <div>
                  <h3 className="security-panel-label">Security Pulse</h3>
                  <div className="d-flex flex-column gap-3">
                    <div className="security-row"><span>Biometric Auth</span><span className="security-status" style={{ color: "var(--clr-tertiary)" }}>Active</span></div>
                    <div className="security-row"><span>Node Encryption</span><span className="security-status" style={{ color: "var(--clr-primary)" }}>Verified</span></div>
                    <div className="security-row"><span>Cloud Sync</span><span className="security-status" style={{ color: "var(--clr-on-surface-variant)" }}>Synced</span></div>
                  </div>
                </div>
                <button className="manage-security-btn">
                  Manage Security
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>

            <div className="col-12">
              <div className="bento-card">
                <div className="d-flex flex-column flex-md-row align-items-md-center gap-4 mb-4">
                  <div className="flex-grow-1">
                    <h3 className="font-headline fw-bold mb-1" style={{ fontSize: "1.2rem" }}>Expand Your Constellation</h3>
                    <p className="card-desc mb-0">Locate and link with other observers across the network.</p>
                  </div>
                  <div className="constellation-input-wrap">
                    <span className="material-symbols-outlined constellation-input-icon">travel_explore</span>
                    <input className="constellation-input" type="text" placeholder="Search by callsign or ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  </div>
                </div>
                <div className="d-flex gap-4 overflow-auto pb-2">
                  {OBSERVERS.map((obs) => (
                    <div key={obs.handle} className="observer-avatar">
                      <img src={obs.src} alt={obs.handle} />
                      <span>{obs.handle}</span>
                    </div>
                  ))}
                  <div className="observer-avatar">
                    <div className="invite-avatar"><span className="material-symbols-outlined">add</span></div>
                    <span>Invite</span>
                  </div>
                </div>
              </div>
            </div>

            {SETTINGS_PANELS.map((panel) => (
              <div key={panel.title} className="col-12 col-md-6">
                <div className="settings-panel">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="d-flex align-items-center gap-3">
                      <div className="settings-icon-wrap" style={{ background: panel.iconBg }}>
                        <span className="material-symbols-outlined" style={{ color: panel.iconColor }}>{panel.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-headline fw-bold mb-0" style={{ fontSize: "1.05rem" }}>{panel.title}</h4>
                        <p className="card-desc mb-0">{panel.desc}</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined" style={{ color: "var(--clr-on-surface-variant)" }}>chevron_right</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="col-12 mt-2">
              <div className="danger-zone d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
                <div className="d-flex align-items-center gap-3">
                  <span className="material-symbols-outlined" style={{ color: "#d73357" }}>emergency_home</span>
                  <p className="danger-text mb-0">Account termination and historical data deletion.</p>
                </div>
                <div className="d-flex gap-3">
                  <button className="btn-sign-out">Sign Out</button>
                  <button className="btn-delete-node">Delete Node</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <nav className="mobile-bottom-nav d-md-none">
        <button className="mobile-bottom-btn"><span className="material-symbols-outlined">home</span>Home</button>
        <button className="mobile-bottom-btn"><span className="material-symbols-outlined">explore</span>Explore</button>
        <button className="mobile-bottom-btn active">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
          Account
        </button>
        <button className="mobile-bottom-btn"><span className="material-symbols-outlined">settings</span>Settings</button>
      </nav>
    </div>
  );
}