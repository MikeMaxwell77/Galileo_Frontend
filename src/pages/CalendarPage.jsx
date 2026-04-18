import { useState, useEffect } from "react";
import "./CalendarPage.css";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const NAV_ITEMS = [
  { label: "Home", icon: "space_dashboard", path: "/" },
  { label: "Explore", icon: "explore", path: "/explore" },
  { label: "Calendar", icon: "calendar_month", path: "/calendar", active: true },
  { label: "Bookmarks", icon: "bookmarks", path: "/bookmarks" },
  { label: "Account", icon: "person", path: "/account" },
];

export default function CalendarPage() {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [calendarCells, setCalendarCells] = useState([]);
  const [modal, setModal] = useState({ type: null, data: null });

  const buildCalendarCells = (month, year) => {
    const cells = [];
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      cells.push({ day: daysInPrevMonth - i, variant: "inactive" });
    }

    const isCurrentMonthYear =
      month === today.getMonth() && year === today.getFullYear();

    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({
        day: d,
        variant: isCurrentMonthYear && d === today.getDate() ? "today" : undefined,
        events: [],
      });
    }

    setCalendarCells(cells);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  useEffect(() => {
    buildCalendarCells(currentMonth, currentYear);
  }, [currentMonth, currentYear]);

  return (
    <div className="page-root">
      <nav className="top-nav">
        <div className="galileo-logo font-headline fw-bold fs-4">Galileo</div>
        <div className="d-none d-md-flex align-items-center gap-4">
          <a href="/" className="nav-link-item">Home</a>
          <a href="/explore" className="nav-link-item">Explore</a>
          <a href="/calendar" className="nav-link-item active">Calendar</a>
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
          <a href="/support" className="sidebar-link"><span className="material-symbols-outlined">help</span>Support</a>
        </div>
      </aside>

      <main className="page-main">
        <div className="page-content">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h1 className="font-headline fw-bold page-title mb-1">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </h1>
              <p className="page-subtitle mb-0">Observational Cycle 42 // Solar Flux: Optimal</p>
            </div>
            <div className="d-flex align-items-center gap-2 cal-nav-controls">
              <button className="nav-chevron-btn" onClick={handlePrevMonth}>
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="nav-chevron-btn" onClick={handleNextMonth}>
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>

          <div className="calendar-grid">
            {DAYS.map((day, i) => (
              <div key={day} className="cal-header-cell" style={{ color: i === 0 ? "var(--clr-primary)" : "var(--clr-on-surface)" }}>
                {day}
              </div>
            ))}
            {calendarCells.map((cell, i) => {
              if (cell.variant === "inactive") return (
                <div key={i} className="cal-cell inactive">
                  <span className="cal-day-num muted">{cell.day}</span>
                </div>
              );
              return (
                <div
                  key={i}
                  className={`cal-cell ${cell.variant === "today" ? "today" : ""}`}
                  onClick={() => setModal({ type: "day", data: { day: cell.day, month: currentMonth, year: currentYear } })}
                  style={{ cursor: "pointer" }}
                >
                  <span className={`cal-day-num ${cell.variant === "today" ? "today-num" : ""}`}>
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

      {modal.type && (
        <div className="modal-overlay" onClick={() => setModal({ type: null, data: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>

            {modal.type === "day" && (
              <>
                <h2 className="font-headline fw-bold">
                  {MONTH_NAMES[modal.data.month]} {modal.data.day}, {modal.data.year}
                </h2>
                <p className="page-subtitle">No events scheduled. — content coming soon.</p>
                <div className="d-flex gap-2 mt-3">
                  <button className="btn-warp" onClick={() => setModal({ type: null, data: null })}>
                    Close
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
