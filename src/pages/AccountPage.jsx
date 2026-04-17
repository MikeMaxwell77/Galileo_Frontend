import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthenticationService from "../auth/AuthenticationService";

const API_BASE_URL = "http://localhost:8080";

const NAV_ITEMS = [
  { label: "Home", icon: "space_dashboard", path: "/" },
  { label: "Explore", icon: "explore", path: "/explore" },
  { label: "Calendar", icon: "calendar_month", path: "/calendar" },
  { label: "Bookmarks", icon: "bookmarks", path: "/bookmarks" },
  { label: "Account", icon: "person", path: "/account", active: true },
];

export default function AccountPage() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // Global search state
  const [searchResults, setSearchResults] = useState([]); 
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  
  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  // Mock data for search results - in a real app, you'd filter this or fetch from API
  const ALL_OBSERVERS = [
    { handle: "@orion_9", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDMcqcfY0SVxutOYgf1WcI-zjup3MwZLq9Lq8C5WQ4Aly46jrtTz4OBwOTuGcef-jvOeUUq7LXbBdys129jSfps55B4VRnc1VipbvFE6BrPAyt8_eK3NrV36WfafllZ5J5Z-_ceekn69oEMt8UUiiA7_X23Ft18avPm1gNAvoflujnbIWvqZu0nNpNfm4Cm1PikxZao65SUnI4ioctrfg92-dmrrDjh2NFpSPrYIedlKpPr9ACmBCkO8H_hfbGv9qC9i6noq1Mx158" },
    { handle: "@nova_flux", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD03CFtNbgq8Swzfpcf44hSerwcYbZYvASdtfEWe3RhawQw42TLTd6TQd9_rYfzFjM6U8fo9dN73WRIs4SkS7WS6Ugnb2Qn8sptZHaegr-JQL-hVfm9qTCqgluvj6UOdIW_nUgMAgptKSVTOqStH6nBDM_PS3YUkLp9yXSsCHu7YNZAMIvjRj3YO_SzkeDDy-eAo07ex6f0tsitxERuUXfXfbmhb3NL-34rxMZ9D-G2gwwz6US_J17hQWYz2B_YdDbWxh7UDSk6hTo" },
    { handle: "@atlas_prime", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvCukNw4CPB9ypH09bt6TOR98TTQrOvf8Te1GYSbBsiTkpzJ0eFIkKTA4aYEydiHepEZ3_Z7K-gQzDHwJIQ4akh5Y8oL1ZEGj7jtYtLr6tPZJb6sb5O3I3rlo2sUvbcGZqNg5dzrR0hSw3_Nw_uN25e2G3WawJh78xUcpMAbN6KhhKwT9ZQ8NLEHJ6T09Jhc3oMUJFwFJnC43LqePDvV06PZfAguq1_5COWlFcIgmxLxTDqIESU3-DmQSaZYa8GN6cG9DnbChEkYo" },
    { handle: "@stella_v", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuByGxdFT4EfeIJoTEin1caBofabJ3lvg-oP7xt2ltoAzShYouGWtRc1yES_l45GXOJcqMaR_kWMOFxcGQ3awZROr5Eb_YJ7xbxTKLrle1s6U719KDibcgQx3O1TwGna8-Zlm8C-5QS3hvHGJ96Lq9qiIW59x24NbO8XEgxlDIrmeCIXT8CZzGskfuKDyDyndBgoemUNo8oDwq9ppybwwoeTNlDeKqcUAu9MzeIGdlbEjidkZWnHjGCXeUup2ihT7drijcFpSNaVu-k" },
  ];

  // Logic to filter "Expand Your Constellation" based on search bar
  const filteredObservers = ALL_OBSERVERS.filter(obs => 
    obs.handle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    loadAccount();
  }, []);

  const loadAccount = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/account/me`, {
        headers: AuthenticationService.getAuthHeader(),
      });
      setAccount(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/account/me`, account, {
        headers: AuthenticationService.getAuthHeader(),
      });
      setEditMode(false);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

// Dynamic Search Integration
  useEffect(() => {
      const delayDebounceFn = setTimeout(async () => {
          if (searchQuery.length > 2) {
              try {
                  const res = await axios.get(`${API_BASE_URL}/accounts/search`, {
                      params: { email: searchQuery },
                      headers: AuthenticationService.getAuthHeader(),
                  });
                  setSearchResults(res.data);
              } catch (err) { console.error("Search failed:", err); }
          } else { setSearchResults([]); }
      }, 300);

      return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  

  if (loading) return <div className="page-root d-flex align-items-center justify-content-center">Synchronizing...</div>;

  return (
    <div className="page-root">
      {/* Top Nav */}
      <nav className="top-nav">
        <div className="d-flex align-items-center gap-4">
          <span className="galileo-logo font-headline fw-bold fs-4">Galileo</span>
        </div>
        <div className="d-flex align-items-center gap-3">
          <button onClick={() => { AuthenticationService.logout(); navigate("/login"); }} className="icon-btn">
            <span className="material-symbols-outlined">logout</span>
          </button>
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
        </div>
        <div className="sidebar-footer d-flex flex-column gap-1" style={{ borderTop: "1px solid rgba(72,71,74,0.15)" }}>
          <a href="/settings" className="sidebar-link"><span className="material-symbols-outlined">settings</span>Settings</a>
          <a href="/support" className="sidebar-link"><span className="material-symbols-outlined">help</span>Support</a>
        </div>
      </aside>

      <main className="page-main">
        <div className="page-content">
          <header className="mb-5">
            <h1 className="font-headline fw-bold page-title mb-1">Command Center</h1>
            <p className="page-subtitle mb-0">Node ID: {account?.id}</p>
          </header>

          <div className="row g-4">
            {/* Account Management Bento */}
            <div className="col-12 col-md-8">
               <div className="bento-card d-flex flex-column flex-md-row align-items-center gap-4">
                <div className="profile-avatar">
                  <img src={`https://ui-avatars.com/api/?name=${account?.email}&background=random`} alt="User" />
                  <button className="avatar-edit-btn" onClick={() => setEditMode(!editMode)}>
                    <span className="material-symbols-outlined">{editMode ? "close" : "edit"}</span>
                  </button>
                </div>
                <div className="flex-grow-1 text-center text-md-start">
                  {!editMode ? (
                    <>
                      <h2 className="font-headline fw-bold mb-0">{account?.email?.split('@')[0]}</h2>
                      <p className="profile-meta">{account?.email}</p>
                    </>
                  ) : (
                    <form onSubmit={handleUpdate} className="d-flex flex-column gap-2">
                      <input className="galileo-input form-control" value={account.email} onChange={(e) => setAccount({...account, email: e.target.value})} />
                      <div className="d-flex gap-2">
                        <button type="submit" className="btn-warp py-1 px-3">Update Core</button>
                        <button type="button" className="btn-sign-out py-1 px-3" style={{background: 'transparent', border: '1px solid var(--clr-outline)'}} onClick={() => setEditMode(false)}>Cancel</button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* Search / Constellation Section */}
            <div className="col-12">
              <div className="bento-card">
                {/* 1. Header and Input Row */}
                <div className="d-flex flex-column flex-md-row align-items-md-center gap-4 mb-4">
                  <div className="flex-grow-1">
                    <h3 className="font-headline fw-bold mb-1" style={{ fontSize: "1.2rem" }}>
                      Locate Observers
                    </h3>
                    <p className="card-desc mb-0">Search the network by callsign or system ID.</p>
                  </div>
                  
                  <div className="constellation-input-wrap">
                    <span className="material-symbols-outlined constellation-input-icon">travel_explore</span>
                    <input 
                      className="constellation-input" 
                      type="text" 
                      placeholder="Enter callsign..." 
                      value={searchQuery} 
                      onChange={(e) => setSearchQuery(e.target.value)} 
                    />
                  </div>
                </div>

                {/* 2. Results Row (Placed below the header/input area) */}
                <div className="d-flex gap-4 overflow-auto pb-2">
                  {searchResults.length > 0 ? (
                    searchResults.map((obs) => (
                      <div key={obs.id} className="observer-avatar text-center">
                        <img 
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${obs.email}`} 
                          alt="node" 
                          style={{ width: '60px', height: '60px', borderRadius: '50%', marginBottom: '8px' }}
                        />
                        <span className="d-block text-truncate" style={{ maxWidth: '80px', fontSize: '0.85rem' }}>
                          {obs.email.split('@')[0]}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="d-flex align-items-center gap-2 text-muted ps-2" style={{ fontSize: '0.9rem' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>radar</span>
                      {searchQuery.length > 2 ? "No nodes found in this sector." : "Awaiting search parameters..."}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="col-12 mt-2">
              <div className="danger-zone d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
                <div className="d-flex align-items-center gap-3">
                  <span className="material-symbols-outlined" style={{ color: "#d73357" }}>emergency_home</span>
                  <p className="danger-text mb-0">Account termination and data wipe.</p>
                </div>
                <div className="d-flex gap-3">
                  <button onClick={() => { AuthenticationService.logout(); navigate("/login"); }} className="btn-sign-out">Sign Out</button>
                  <button onClick={async () => {
                    if(window.confirm("Erase Node?")) {
                       await axios.delete(`${API_BASE_URL}/account/me`, { headers: AuthenticationService.getAuthHeader() });
                       AuthenticationService.logout();
                       navigate("/login");
                    }
                  }} className="btn-delete-node">Delete Node</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}