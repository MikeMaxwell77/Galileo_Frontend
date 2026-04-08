import { useState } from "react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CALENDAR_CELLS = [
  { day: 29, variant: "inactive" },
  { day: 30, variant: "inactive" },
  { day: 1,  events: [] },
  { day: 2,  events: [{ text: "Interstellar Research Paper on Quantum Foams", color: "primary" }] },
  { day: 3,  variant: "tertiary", events: [{ text: "Warning: Star System Deprecation", color: "tertiary" }] },
  { day: 4,  events: [] },
  { day: 5,  events: [] },
  { day: 6,  events: [] },
  { day: 7,  events: [] },
  { day: 8,  variant: "today", events: [{ text: "The Architecture of Void-based Data Structures and Long-form Storage", color: "secondary" }] },
  { day: 9,  events: [] },
  { day: 10, events: [{ text: "System Snapshot #9042", color: "neutral" }] },
  { day: 11, events: [] },
  { day: 12, events: [] },
  { day: 13, events: [] },
  { day: 14, events: [] },
  { day: 15, events: [] },
  { day: 16, events: [{ text: "Galaxy Cluster Mapping", color: "primary" }, { text: "Nebula Color Palettes", color: "secondary" }] },
  { day: 17, events: [] },
  { day: 18, events: [] },
  { day: 19, events: [] },
  ...Array(14).fill({ variant: "empty" }),
];

const NAV_ITEMS = [
  { label: "Home",      icon: "space_dashboard", path: "/" },
  { label: "Explore",   icon: "explore",         path: "/explore" },
  { label: "Calendar",  icon: "calendar_month",  path: "/calendar", active: true },
  { label: "Bookmarks", icon: "bookmarks",       path: "/bookmarks" },
  { label: "Account",   icon: "person",          path: "/account" },
];

export default function CalendarPage() {
  return (
    <div className="page-root">
      <nav className="top-nav">
        <div className="galileo-logo font-headline fw-bold fs-4">Galileo</div>
        <div className="d-none d-md-flex align-items-center gap-4">
          <a href="/"          className="nav-link-item">Home</a>
          <a href="/explore"   className="nav-link-item">Explore</a>
          <a href="/calendar"  className="nav-link-item active">Calendar</a>
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
          <button className="btn-warp d-flex align-items-center justify-content-center gap-2 mb-3" style={{ width: "100%", borderRadius: "0.75rem", padding: "0.75rem", fontSize: "0.8rem" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>add</span>
            New Observation
          </button>
          <nav className="d-flex flex-column gap-1">
            {NAV_ITEMS.map((item) => (
              <a key={item.label} href={item.path} className={`sidebar-link ${item.active ? "active" : ""}`}>
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="sidebar-footer d-flex flex-column gap-1">
          <a href="/settings" className="sidebar-link"><span className="material-symbols-outlined">settings</span>Settings</a>
          <a href="/support"  className="sidebar-link"><span className="material-symbols-outlined">help</span>Support</a>
        </div>
      </aside>

      <main className="page-main">
        <div className="page-content">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h1 className="font-headline fw-bold page-title mb-1">October 2024</h1>
              <p className="page-subtitle mb-0">Observational Cycle 42 // Solar Flux: Optimal</p>
            </div>
            <div className="d-flex align-items-center gap-2 cal-nav-controls">
              <button className="nav-chevron-btn"><span className="material-symbols-outlined">chevron_left</span></button>
              <button className="nav-chevron-btn"><span className="material-symbols-outlined">chevron_right</span></button>
            </div>
          </div>

          <div className="calendar-grid">
            {DAYS.map((day, i) => (
              <div key={day} className="cal-header-cell" style={{ color: i === 0 ? "var(--clr-primary)" : "var(--clr-on-surface)" }}>
                {day}
              </div>
            ))}
            {CALENDAR_CELLS.map((cell, i) => {
              if (cell.variant === "empty") return <div key={i} className="cal-cell empty" />;
              if (cell.variant === "inactive") return (
                <div key={i} className="cal-cell inactive">
                  <span className="cal-day-num muted">{cell.day}</span>
                </div>
              );
              return (
                <div key={i} className={`cal-cell ${cell.variant === "today" ? "today" : ""}`}>
                  <span className={`cal-day-num ${cell.variant === "today" ? "today-num" : cell.variant === "tertiary" ? "tertiary-num" : ""}`}>
                    {cell.day}
                  </span>
                  {cell.events && cell.events.map((ev, j) => (
                    <div key={j} className={`cal-event ${ev.color}`}>{ev.text}</div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <button className="fab-btn">
        <span className="material-symbols-outlined" style={{ fontSize: "1.75rem", color: "var(--clr-on-primary)" }}>rocket_launch</span>
      </button>
    </div>
  );
}