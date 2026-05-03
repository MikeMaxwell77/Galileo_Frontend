import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationService from "../auth/AuthenticationService";

const NAV_ITEMS = [
  { key: "home", label: "Home", icon: "space_dashboard", path: "/home" },
  { key: "explore", label: "Explore", icon: "explore", path: "/explore" },
  { key: "calendar", label: "Calendar", icon: "calendar_month", path: "/calendar" },
  { key: "bookmarks", label: "Bookmarks", icon: "bookmarks", path: "/bookmarks" },
  { key: "solar", label: "Solar System", icon: "language", path: "/solar-system", topNavOnly: true },
  { key: "account", label: "Account", icon: "person", path: "/account" },
];

export default function Navbar({ active }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsAuthenticated(AuthenticationService.isAuthenticated());
  }, []);

  const handleAccount = () => {
    if (isAuthenticated) navigate("/account");
    else navigate("/login");
  };

  return (
    <>
      {/* Top nav (mobile + desktop) */}
      <nav className="top-nav">
        <div className="d-flex align-items-center gap-2">
          <button
            className="icon-btn d-lg-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open navigation menu"
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
          <Link to="/home" className="galileo-logo font-headline fw-bold fs-4 text-decoration-none">
            Galileo
          </Link>
        </div>

        <div className="d-none d-md-flex align-items-center gap-4">
          {NAV_ITEMS.filter(i => i.key !== "account").map(item => (
            <Link
              key={item.key}
              to={item.path}
              className={`nav-link-item ${active === item.key ? "active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="d-flex align-items-center gap-2 gap-md-3">
          {!isAuthenticated && (
            <button
              className="btn-warp btn-warp-sm"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          )}
          <button
            className="icon-btn"
            onClick={handleAccount}
            aria-label="Account"
          >
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </nav>

      {/* Mobile drop-down menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer d-lg-none" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer-inner" onClick={e => e.stopPropagation()}>
            {NAV_ITEMS.filter(i => !i.topNavOnly).map(item => (
              <Link
                key={item.key}
                to={item.path}
                className={`sidebar-link ${active === item.key ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="sidebar d-none d-lg-flex flex-column">
        <div className="sidebar-inner">
          <div className="galileo-logo font-headline fw-black mb-1">Galileo</div>
          <div className="sidebar-section-label">Navigation</div>
          <nav className="d-flex flex-column gap-1">
            {NAV_ITEMS.filter(i => !i.topNavOnly).map(item => (
              <Link
                key={item.key}
                to={item.path}
                className={`sidebar-link ${active === item.key ? "active" : ""}`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="sidebar-footer">
          <button className="sidebar-new-obs-btn" onClick={() => navigate("/explore")}>
            New Observation
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <div className="mobile-nav-bar d-lg-none">
        {NAV_ITEMS.filter(i => !i.topNavOnly).map(item => (
          <Link
            key={item.key}
            to={item.path}
            className={`mobile-nav-btn ${active === item.key ? "active" : ""}`}
            aria-label={item.label}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
