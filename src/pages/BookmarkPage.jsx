import { useState, useEffect } from "react";

import BookmarkService from "../GalileoBackendServices/BookmarksService";
import AuthenticationService from "../auth/AuthenticationService";

const SIGNALS = [
  { id: 1, icon: "pulse_alert", iconColor: "var(--clr-primary)",   iconBg: "rgba(224,142,254,0.1)", title: "Alpha-Centauri-Prime", type: "Terrestrial Signal",  url: "https://deepspace.observatory/ac-01.dat",          date: "Oct 14, 2142", size: "1.42 PB",   action: "View" },
  { id: 2, icon: "warning",     iconColor: "var(--clr-tertiary)",  iconBg: "rgba(255,231,146,0.1)", title: "Nebula-Shroud-77",     type: "Anomalous Data",      url: "https://deepspace.observatory/anomaly-shroud.dat", date: "Nov 02, 2142", size: "894.2 TB", action: "Open" },
  { id: 3, icon: "satellite_alt",iconColor: "var(--clr-primary)",  iconBg: "rgba(224,142,254,0.1)", title: "Vesta-Orbiter-Scan",   type: "Automated Telemetry", url: "https://vesta-mission.sol/telemetry/v-scan.log",    date: "Dec 19, 2142", size: "12.5 GB",  action: "View" },
  { id: 4, icon: "star",        iconColor: "var(--clr-secondary)", iconBg: "rgba(186,146,250,0.1)", title: "Orion-Belt-Echo",      type: "Stellar Cartography", url: "https://orion-archive.org/echo-mapping.viz",       date: "Jan 05, 2143", size: "4.88 PB",   action: "Open" },
];

const NAV_ITEMS = [
  { label: "Home",      icon: "space_dashboard", path: "/home" },
  { label: "Explore",   icon: "explore",         path: "/explore" },
  { label: "Calendar",  icon: "calendar_month",  path: "/calendar" },
  { label: "Bookmarks", icon: "bookmarks",       path: "/bookmarks", active: true },
  { label: "Account",   icon: "person",          path: "/account" },
];

export default function BookmarksPage() {
  const [userSearch, setUserSearch] = useState("");

  const [authenticated, setAuthenticated] = useState(false);
  
  const [loadingMyBM, setLoadingMyBM] = useState(true);
  const [loadingOtherBM, setLoadingOtherBM] = useState(true);

  const [myBookmarks, setMyBookmarks] = useState([]);
  const [otherBookmarks, setOtherBookmarks] = useState([]);

  const loadMyBookmarks = async () => {
    setLoadingMyBM(true);

    try {
      const res = await BookmarkService.GetAuthUserBookmarks();
      if (res) setMyBookmarks(res);
      console.log(res)
    } catch (err) {
      console.error("Failed to load bookmarks", err);
    } finally {
      setLoadingMyBM(false);
    }
  };

  const mapBookmarkToSignal = (bm) => {
    return {
      title: bm.API_identifier.toUpperCase(),
      observer_pos: `${bm.longitude} : ${bm.latitude}`,
      dateStr: new Date(bm.timestamp).toLocaleString(),
      API: bm.whichAPI
    }
  }

  useEffect(()=>{
    // Init effect
    setAuthenticated(AuthenticationService.isAuthenticated());
   

  }, [])

  useEffect(()=>{
    if (authenticated) {
      loadMyBookmarks();
    }
  }, [authenticated])


  const handleDelete = async (id) => {
    try {
      await BookmarkService.DeleteBookmarkByID(id);

      // remove from UI immediately
      setMyBookmarks(prev => prev.filter(bm => bm.id !== id));

    } catch (err) {
      console.error("Failed to delete bookmark", err);
    }
  };

  return (
    <div className="page-root">

      {/* ── Sidebar ── */}
      <aside className="sidebar d-none d-lg-flex flex-column">
        <div className="p-4 py-5">
          <h1 className="galileo-logo font-headline fw-black" style={{ fontSize: "1.2rem", marginBottom: "0.25rem" }}>Galileo</h1>
          <p className="sidebar-section-label" style={{ color: "rgba(224,142,254,0.6)" }}>Cosmic Cartographer</p>
        </div>

        <nav className="flex-grow-1">
          <div className="px-4 py-3">
            <span className="sidebar-section-label" style={{ color: "rgba(224,142,254,0.6)" }}>Navigation</span>
          </div>
          {NAV_ITEMS.map((item) => (
            <a key={item.label} href={item.path} className={`sidebar-link ${item.active ? "active" : ""}`}>
              <span className="material-symbols-outlined" style={ item.active ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="mt-auto p-4" style={{ borderTop: "1px solid rgba(72,71,74,0.15)" }}>
          <button className="btn-warp mb-4" style={{ borderRadius: "0.75rem", fontSize: "0.875rem" }}>
            New Observation
          </button>
          <div className="d-flex flex-column gap-1">
            <a href="/settings" className="sidebar-link"><span className="material-symbols-outlined">settings</span>Settings</a>
            <a href="/support"  className="sidebar-link"><span className="material-symbols-outlined">help</span>Support</a>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="page-main">

        {/* ── Top Bar ── */}
        <header className="bookmarks-topbar">
          <div className="d-flex align-items-center gap-3">
            <span className="material-symbols-outlined d-lg-none" style={{ color: "var(--clr-primary)", cursor: "pointer" }}>menu</span>
            <h2 className="font-headline fw-bold" style={{ fontSize: "1.4rem", letterSpacing: "-0.02em" }}>Stored Bookmarks</h2>
          </div>
          <div className="d-flex align-items-center gap-4">
            <span className="material-symbols-outlined" style={{ color: "var(--clr-outline)", cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "var(--clr-primary)"}
              onMouseLeave={e => e.target.style.color = "var(--clr-outline)"}>
              search
            </span>
            <div className="bookmarks-avatar">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmY9SWBevIIRe5yI4hHo3OcYuKJEOeAhB4Sxvl9F_gYqjFojCys12v5tBjIXg92kgqlaNpVfUEMXaXt3jtRnZVU-97jKw9T2Tl3ww3IQUHncQ0REavv9oJW6AKFHNgPTVcOzTc6UrssLRC6kbwlZa57Czeccz8R_fhY4ycRNK9x-aYD8F58AVEmfLVvfU_A-H5o4iG_cTW7Fr1KTMNzGAbNIrtj9UHGU8veKfST3gYZX7UJBOw6Deb-U6czaCf8-o256G9J6L4SEA"
                alt="User Profile"
              />
            </div>
          </div>
        </header>

        {/* ── Content ── */}
        <div className="page-content">

          {/* User search input */}
          <div className="mb-4" style={{ maxWidth: "420px" }}>
            <div className="position-relative">
              <span className="material-symbols-outlined input-icon">person_search</span>
              <input
                className="galileo-input form-control"
                type="text"
                placeholder="Searching for other users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Bookmarks table */}
          {authenticated &&(
            <div className="bookmarks-table-wrap">
              <div className="table-responsive">
                <h3 className="text-center">My Bookmarks</h3>
                <table className="bookmarks-table w-100">
                  <thead>
                    <tr className="bookmarks-thead-row">
                      <th className="bookmarks-th">Object Identifier</th>
                      <th className="bookmarks-th">Observer Pos - long : lat</th>
                      <th className="bookmarks-th">Bookmark Date</th>
                      <th className="bookmarks-th">API</th>
                      <th className="bookmarks-th text-end">Delete bookmark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myBookmarks && myBookmarks.map((bm) => {
                      const sig = mapBookmarkToSignal(bm);

                      return (
                        <tr key={bm.id} className="bookmarks-row">

                          {/* OBJECT IDENTIFIER */}
                          <td className="bookmarks-td">
                            <div className="d-flex align-items-center gap-3">
                              <div
                                className="bookmarks-row-icon"
                                style={{
                                  background: "rgba(224,142,254,0.1)",
                                  color: "var(--clr-primary)"
                                }}
                              >
                                <span className="material-symbols-outlined">star</span>
                              </div>
                              <div>
                                <div className="font-headline fw-bold" style={{ fontSize: "0.95rem" }}>
                                  {sig.title}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* COORDINATES */}
                          <td className="bookmarks-td">
                            <code className="bookmarks-url">
                              {sig.observer_pos}
                            </code>
                          </td>

                          {/* DATE */}
                          <td className="bookmarks-td bookmarks-date">
                            {sig.dateStr}
                          </td>

                          {/* API */}
                          <td className="bookmarks-td text-end">
                            {sig.API}
                          </td>
                          
                          <td className="bookmarks-td text-end">
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDelete(bm.id)}
                            >
                              Delete
                            </button>
                          </td>


                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!authenticated && (
            <h2>Log in to view your and other users's bookmars</h2>
          )}
         

          {/* Background decor */}
          <div className="bookmarks-decor">
            <div className="bookmarks-decor-gradient" />
            <div className="bookmarks-decor-nebula" />
          </div>

        </div>
      </main>
    </div>
  );
}