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

const getMoonPhaseData = (date) => {
  const knownNewMoon = new Date("2000-01-06T18:14:00Z").getTime();
  const lunarCycle = 29.530588853 * 24 * 60 * 60 * 1000;
  const pct = ((date.getTime() - knownNewMoon) % lunarCycle + lunarCycle) % lunarCycle / lunarCycle;
  let name;
  if (pct < 0.033 || pct >= 0.967) name = "New Moon";
  else if (pct < 0.25)  name = "Waxing Crescent";
  else if (pct < 0.283) name = "First Quarter";
  else if (pct < 0.5)   name = "Waxing Gibbous";
  else if (pct < 0.533) name = "Full Moon";
  else if (pct < 0.75)  name = "Waning Gibbous";
  else if (pct < 0.783) name = "Last Quarter";
  else name = "Waning Crescent";
  return { phase: pct, name };
};

// SVG moon phase disc — phase is 0–1 (0=new, 0.5=full, 1=new)
const MoonPhaseVisual = ({ phase, size = 72 }) => {
  const r = (size - 4) / 2;
  // Illumination fraction via standard formula
  const k = (1 - Math.cos(2 * Math.PI * phase)) / 2;
  const isWaxing = phase < 0.5;

  let litPath = null;
  if (k >= 0.99) {
    litPath = "full";
  } else if (k > 0.01) {
    // Terminator ellipse x-radius: 0 at quarter, r at new/full
    const tRx = r * Math.abs(2 * k - 1);
    // Which side is the lit semicircle on (sweep=1 → right/clockwise, sweep=0 → left/ccw)
    const halfSweep = isWaxing ? 1 : 0;
    // Terminator direction flips at gibbous vs crescent, and again at waning vs waxing
    const tSweep = isWaxing ? (k >= 0.5 ? 1 : 0) : (k >= 0.5 ? 0 : 1);
    litPath = `M 0,${-r} A ${r},${r} 0 1,${halfSweep} 0,${r} A ${tRx},${r} 0 1,${tSweep} 0,${-r} Z`;
  }

  return (
    <svg width={size} height={size} viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}>
      <circle r={r} fill="rgba(10,8,20,0.95)" stroke="rgba(255,240,200,0.25)" strokeWidth="1" />
      {litPath === "full" && <circle r={r} fill="rgba(255,240,200,0.9)" />}
      {litPath && litPath !== "full" && <path d={litPath} fill="rgba(255,240,200,0.9)" />}
    </svg>
  );
};

const formatTime = (isoString) => {
  if (!isoString) return "—";
  try { return new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }
  catch { return "—"; }
};

const SUN_EVENT_LABELS = { rise: "Sunrise", set: "Sunset", transit: "Solar Noon" };
const MOON_EVENT_LABELS = { rise: "Moonrise", set: "Moonset", transit: "Moon Transit" };

// Module-level cache — persists across re-renders, cleared on page reload
const _cache = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const _getCache = (key) => {
  const e = _cache.get(key);
  if (!e) return undefined;
  if (Date.now() - e.ts > CACHE_TTL_MS) { _cache.delete(key); return undefined; }
  return e.data;
};
const _setCache = (key, data) => _cache.set(key, { data, ts: Date.now() });

export default function CalendarPage() {
  const today = new Date();
  const { geoData, hasGeoData } = useGeoLocation();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear]   = useState(today.getFullYear());
  const [calendarCells, setCalendarCells] = useState([]);
  const [modal,         setModal]         = useState({ type: null, data: null });
  const [dayData,       setDayData]       = useState({ loading: false, weather: null, sunEvents: null, moonEvents: null });
  const [bodyPositions, setBodyPositions] = useState(null);

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

    const daysDiff = Math.floor((date - new Date()) / (1000 * 60 * 60 * 24));
    const withinForecastWindow = daysDiff >= 0 && daysDiff <= 10;

    const locKey = `${parseFloat(geoData.latitude).toFixed(4)}:${parseFloat(geoData.longitude).toFixed(4)}`;
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const wKey  = `weather:${locKey}:${dateStr}`;
    const sKey  = `sun:${locKey}:${dateStr}`;
    const mKey  = `moon:${locKey}:${dateStr}`;

    const fetchAll = async () => {
      const cW = withinForecastWindow ? _getCache(wKey) : null;
      const cS = _getCache(sKey);
      const cM = _getCache(mKey);

      const [weatherResult, sunResult, moonResult] = await Promise.allSettled([
        cW !== undefined
          ? Promise.resolve(cW)
          : withinForecastWindow
            ? WeatherService.FetchForecastForDate({ latitude: geoData.latitude, longitude: geoData.longitude, date })
            : Promise.resolve(null),
        cS !== undefined
          ? Promise.resolve(cS)
          : AstronomyBodiesInterface.FetchEventsOnDate({ bodyid: "sun",  latitude: geoData.latitude, longitude: geoData.longitude, elevation: geoData.elevation ?? 0, date }),
        cM !== undefined
          ? Promise.resolve(cM)
          : AstronomyBodiesInterface.FetchEventsOnDate({ bodyid: "moon", latitude: geoData.latitude, longitude: geoData.longitude, elevation: geoData.elevation ?? 0, date }),
      ]);

      const weather    = weatherResult.status === "fulfilled" ? weatherResult.value : null;
      const sunEvents  = sunResult.status     === "fulfilled" ? sunResult.value     : null;
      const moonEvents = moonResult.status    === "fulfilled" ? moonResult.value    : null;

      if (withinForecastWindow && cW === undefined && weather   !== null) _setCache(wKey, weather);
      if (cS === undefined && sunEvents  !== null) _setCache(sKey, sunEvents);
      if (cM === undefined && moonEvents !== null) _setCache(mKey, moonEvents);

      setDayData({ loading: false, weather, sunEvents, moonEvents });
    };

    fetchAll();
  }, [modal.data]);

  useEffect(() => {
    if (!hasGeoData || !geoData) return;

    const locKey = `${parseFloat(geoData.latitude).toFixed(4)}:${parseFloat(geoData.longitude).toFixed(4)}`;
    const posKey = `positions:${locKey}`;
    const cached = _getCache(posKey);
    if (cached !== undefined) { setBodyPositions(cached); return; }

    const now    = new Date();
    const untill = new Date(now);
    untill.setDate(untill.getDate() + 10);

    AstronomyBodiesInterface.FetchAllBodyPositions({
      longitude: geoData.longitude,
      latitude:  geoData.latitude,
      elevation: geoData.elevation ?? 0,
      now,
      untill,
    }).then((data) => {
      if (data) { _setCache(posKey, data); setBodyPositions(data); }
    });
  }, [hasGeoData, geoData]);

  const { day: selDay, month: selMonth, year: selYear } = modal.data ?? {};
  const selectedDate         = modal.data ? new Date(selYear, selMonth, selDay) : null;
  const moonPhaseData        = selectedDate ? getMoonPhaseData(selectedDate) : null;
  const _selDaysDiff         = selectedDate ? Math.floor((selectedDate - new Date()) / 864e5) : null;
  const withinForecastWindow = _selDaysDiff !== null ? (_selDaysDiff >= 0 && _selDaysDiff <= 10) : false;
  const withinPositionWindow = _selDaysDiff !== null ? (_selDaysDiff >= 0 && _selDaysDiff <= 10) : false;

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
                  {moonPhaseData && (
                    <div className="d-flex flex-column align-items-center gap-1">
                      <MoonPhaseVisual phase={moonPhaseData.phase} size={72} />
                      <span className="page-subtitle mb-0" style={{ fontSize: "0.7rem", letterSpacing: "0.05em" }}>
                        {moonPhaseData.name}
                      </span>
                    </div>
                  )}
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
                          {!withinForecastWindow
                            ? "Weather data only available within 10 days of today's date."
                            : "Unavailable — weather.gov covers US locations only."}
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
                          <div key={i} style={{ fontSize: "0.85rem", marginBottom: "0.25rem" }}>
                            {SUN_EVENT_LABELS[ev.type] ?? ev.type}: <strong>{formatTime(ev.time)}</strong>
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
                          <div key={i} style={{ fontSize: "0.85rem", marginBottom: "0.25rem" }}>
                            {MOON_EVENT_LABELS[ev.type] ?? ev.type}: <strong>{formatTime(ev.time)}</strong>
                          </div>
                        ))
                      ) : (
                        <p className="page-subtitle mb-0" style={{ fontSize: "0.8rem" }}>No events found.</p>
                      )}
                    </div>

                    {withinPositionWindow && (() => {
                      const dateStr = `${selYear}-${String(selMonth + 1).padStart(2, "0")}-${String(selDay).padStart(2, "0")}`;
                      const rows = bodyPositions?.data?.rows ?? bodyPositions?.rows ?? [];
                      const PRIORITY = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn"];
                      const filtered = rows.filter(r => PRIORITY.includes(r.body?.id));
                      if (filtered.length === 0) return null;
                      return (
                        <div className="col-12">
                          <h4 className="font-headline fw-bold mb-2"
                            style={{ fontSize: "0.7rem", letterSpacing: "0.12em", color: "var(--clr-on-surface-variant)" }}>
                            BODY POSITIONS AT NOON
                          </h4>
                          <div className="d-flex flex-wrap gap-4">
                            {filtered.map((row, i) => {
                              const pos = (row.positions ?? []).find(p => typeof p.date === "string" && p.date.startsWith(dateStr));
                              if (!pos) return null;
                              const alt = pos.horizontal?.altitude?.degrees ?? "—";
                              const az  = pos.horizontal?.azimuth?.degrees  ?? "—";
                              const con = pos.constellation?.short ?? "";
                              return (
                                <div key={i} style={{ fontSize: "0.8rem", minWidth: "80px" }}>
                                  <div style={{ fontWeight: 600, textTransform: "capitalize" }}>{row.body.name}</div>
                                  <div style={{ color: "var(--clr-on-surface-variant)" }}>
                                    Alt {alt}° · Az {az}°{con ? ` · ${con}` : ""}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}

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
