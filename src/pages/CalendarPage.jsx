import { useState, useEffect } from "react";
import "./CalendarPage.css";
import { useGeoLocation } from "../components/geoLocation/GeoLocation";
import { AstronomyBodiesInterface } from "../astronomyAPI/BodiesApi";
import { WeatherService } from "../GalileoBackendServices/WeatherService";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const NAV_ITEMS = [
  { label: "Home",      icon: "space_dashboard", path: "/" },
  { label: "Explore",   icon: "explore",         path: "/explore" },
  { label: "Calendar",  icon: "calendar_month",  path: "/calendar", active: true },
  { label: "Bookmarks", icon: "bookmarks",       path: "/bookmarks" },
  { label: "Account",   icon: "person",          path: "/account" },
];

const getMoonPhase = (date) => {
  const knownNewMoon = new Date("2000-01-06T18:14:00Z").getTime();
  const lunarCycle = 29.530588853 * 24 * 60 * 60 * 1000;
  const pct = ((date.getTime() - knownNewMoon) % lunarCycle + lunarCycle) % lunarCycle / lunarCycle;
  if (pct < 0.033 || pct >= 0.967) return "New Moon";
  if (pct < 0.25)  return "Waxing Crescent";
  if (pct < 0.283) return "First Quarter";
  if (pct < 0.5)   return "Waxing Gibbous";
  if (pct < 0.533) return "Full Moon";
  if (pct < 0.75)  return "Waning Gibbous";
  if (pct < 0.783) return "Last Quarter";
  return "Waning Crescent";
};

const formatTime = (isoString) => {
  if (!isoString) return "—";
  try { return new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }
  catch { return "—"; }
};

export default function CalendarPage() {
  const today = new Date();
  const { geoData, hasGeoData } = useGeoLocation();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear]   = useState(today.getFullYear());
  const [calendarCells, setCalendarCells] = useState([]);
  const [modal,   setModal]   = useState({ type: null, data: null });
  const [dayData, setDayData] = useState({ loading: false, weather: null, sunEvents: null, moonEvents: null });

  const buildCalendarCells = (month, year) => {
    const cells = [];
    const firstDay      = new Date(year, month, 1).getDay();
    const daysInMonth   = new Date(year, month + 1, 0).getDate();
    const daysInPrev    = new Date(year, month, 0).getDate();

    for (let i = firstDay - 1; i >= 0; i--)
      cells.push({ day: daysInPrev - i, variant: "inactive" });

    const isThisMonthYear = month === today.getMonth() && year === today.getFullYear();
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({
        day: d,
        variant: isThisMonthYear && d === today.getDate() ? "today" : undefined,
        events: [],
      });
    }

    setCalendarCells(cells);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
  };

  useEffect(() => {
    buildCalendarCells(currentMonth, currentYear);
  }, [currentMonth, currentYear]);

  useEffect(() => {
    if (modal.type !== "day" || !modal.data || !hasGeoData || !geoData) return;

    const { day, month, year } = modal.data;
    const date = new Date(year, month, day, 12, 0, 0);

    setDayData({ loading: true, weather: null, sunEvents: null, moonEvents: null });

    const fetchAll = async () => {
      const [weatherResult, sunResult, moonResult] = await Promise.allSettled([
        WeatherService.FetchForecastForDate({ latitude: geoData.latitude, longitude: geoData.longitude, date }),
        AstronomyBodiesInterface.FetchEventsOnDate({ bodyid: "sun",  latitude: geoData.latitude, longitude: geoData.longitude, elevation: geoData.elevation ?? 0, date }),
        AstronomyBodiesInterface.FetchEventsOnDate({ bodyid: "moon", latitude: geoData.latitude, longitude: geoData.longitude, elevation: geoData.elevation ?? 0, date }),
      ]);

      setDayData({
        loading:    false,
        weather:    weatherResult.status === "fulfilled" ? weatherResult.value : null,
        sunEvents:  sunResult.status    === "fulfilled" ? sunResult.value    : null,
        moonEvents: moonResult.status   === "fulfilled" ? moonResult.value   : null,
      });
    };

    fetchAll();
  }, [modal.data]);

  const { day: selDay, month: selMonth, year: selYear } = modal.data ?? {};
  const selectedDate = modal.data ? new Date(selYear, selMonth, selDay) : null;
  const moonPhase    = selectedDate ? getMoonPhase(selectedDate) : null;

  const sunEvents  = dayData.sunEvents?.data?.events  ?? [];
  const moonEvents = dayData.moonEvents?.data?.events ?? [];

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
          <button className="btn-warp d-flex align-items-center justify-content-center gap-2 mb-3"
            style={{ width: "100%", borderRadius: "0.75rem", padding: "0.75rem", fontSize: "0.8rem" }}>
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
              <div key={day} className="cal-header-cell"
                style={{ color: i === 0 ? "var(--clr-primary)" : "var(--clr-on-surface)" }}>
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
                <div key={i}
                  className={`cal-cell ${cell.variant === "today" ? "today" : ""}`}
                  onClick={() => setModal({ type: "day", data: { day: cell.day, month: currentMonth, year: currentYear } })}
                  style={{ cursor: "pointer" }}>
                  <span className={`cal-day-num ${cell.variant === "today" ? "today-num" : ""}`}>
                    {cell.day}
                  </span>
                  {cell.events.map((ev, j) => (
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
          <div className="cal-modal-content" onClick={(e) => e.stopPropagation()}>

            {modal.type === "day" && (
              <>
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <h2 className="font-headline fw-bold mb-0">
                    {MONTH_NAMES[selMonth]} {selDay}, {selYear}
                  </h2>
                  <span className="page-subtitle mb-0" style={{ textAlign: "right" }}>{moonPhase}</span>
                </div>

                {!hasGeoData && (
                  <p className="page-subtitle">
                    Share your location on the Explore page to see sky events and local weather.
                  </p>
                )}

                {hasGeoData && dayData.loading && (
                  <p className="page-subtitle">Loading sky data...</p>
                )}

                {hasGeoData && !dayData.loading && (
                  <div className="row g-4">

                    <div className="col-12 col-md-6">
                      <h4 className="font-headline fw-bold mb-2"
                        style={{ fontSize: "0.7rem", letterSpacing: "0.12em", color: "var(--clr-tertiary)" }}>
                        WEATHER
                      </h4>
                      {dayData.weather?.length > 0 ? (
                        dayData.weather.map((p, i) => (
                          <div key={i} className="mb-2" style={{ fontSize: "0.85rem" }}>
                            <div><strong>{p.name}</strong></div>
                            <div>{p.temperature}°{p.temperatureUnit} — {p.shortForecast}</div>
                            {p.windSpeed && (
                              <div style={{ color: "var(--clr-on-surface-variant)", fontSize: "0.8rem" }}>
                                Wind: {p.windSpeed} {p.windDirection}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="page-subtitle mb-0" style={{ fontSize: "0.8rem" }}>
                          Unavailable — weather.gov covers US locations only.
                        </p>
                      )}
                    </div>

                    <div className="col-12 col-md-3">
                      <h4 className="font-headline fw-bold mb-2"
                        style={{ fontSize: "0.7rem", letterSpacing: "0.12em", color: "var(--clr-primary)" }}>
                        SUN
                      </h4>
                      {sunEvents.length > 0 ? (
                        sunEvents.map((ev, i) => (
                          <div key={i} style={{ fontSize: "0.85rem", textTransform: "capitalize", marginBottom: "0.25rem" }}>
                            {ev.type}: <strong>{formatTime(ev.time)}</strong>
                          </div>
                        ))
                      ) : (
                        <p className="page-subtitle mb-0" style={{ fontSize: "0.8rem" }}>No events found.</p>
                      )}
                    </div>

                    <div className="col-12 col-md-3">
                      <h4 className="font-headline fw-bold mb-2"
                        style={{ fontSize: "0.7rem", letterSpacing: "0.12em", color: "var(--clr-secondary)" }}>
                        MOON
                      </h4>
                      {moonEvents.length > 0 ? (
                        moonEvents.map((ev, i) => (
                          <div key={i} style={{ fontSize: "0.85rem", textTransform: "capitalize", marginBottom: "0.25rem" }}>
                            {ev.type}: <strong>{formatTime(ev.time)}</strong>
                          </div>
                        ))
                      ) : (
                        <p className="page-subtitle mb-0" style={{ fontSize: "0.8rem" }}>No events found.</p>
                      )}
                    </div>

                  </div>
                )}

                <div className="d-flex gap-2 mt-4">
                  <button className="btn-warp" onClick={() => setModal({ type: null, data: null })}>Close</button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
