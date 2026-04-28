import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CalendarPage.css";
import { useGeoLocation } from "../components/geoLocation/GeoLocation";
import { AstronomyBodiesInterface } from "../astronomyAPI/BodiesApi";
import { WeatherService } from "../GalileoBackendServices/WeatherService";
import AuthenticationService from "../auth/AuthenticationService";
import BookmarkService from "../GalileoBackendServices/BookmarksService";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const NAV_ITEMS = [
  { label: "Home", icon: "space_dashboard", path: "/home" },
  { label: "Explore", icon: "explore", path: "/explore" },
  { label: "Calendar", icon: "calendar_month", path: "/calendar", active: true },
  { label: "Bookmarks", icon: "bookmarks", path: "/bookmarks" },
  { label: "Account", icon: "person", path: "/account" },
];

const getMoonPhaseData = (date) => {
  const knownNewMoon = new Date("2000-01-06T18:14:00Z").getTime();
  const lunarCycle = 29.530588853 * 24 * 60 * 60 * 1000;
  const pct = ((date.getTime() - knownNewMoon) % lunarCycle + lunarCycle) % lunarCycle / lunarCycle;
  let name;
  if (pct < 0.033 || pct >= 0.967) name = "New Moon";
  else if (pct < 0.25) name = "Waxing Crescent";
  else if (pct < 0.283) name = "First Quarter";
  else if (pct < 0.5) name = "Waxing Gibbous";
  else if (pct < 0.533) name = "Full Moon";
  else if (pct < 0.75) name = "Waning Gibbous";
  else if (pct < 0.783) name = "Last Quarter";
  else name = "Waning Crescent";
  return { phase: pct, name };
};

// SVG sun disc — static, always fully illuminated
const SunVisual = ({ size = 72 }) => {
  const r = (size - 4) / 2;
  const rays = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <svg width={size} height={size} viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}>
      <circle r={r} fill="rgba(255,210,80,0.08)" stroke="rgba(255,210,80,0.2)" strokeWidth="1" />
      {rays.map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = Math.cos(rad) * (r * 0.65);
        const y1 = Math.sin(rad) * (r * 0.65);
        const x2 = Math.cos(rad) * (r * 0.88);
        const y2 = Math.sin(rad) * (r * 0.88);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,210,80,0.75)" strokeWidth="1.5" strokeLinecap="round" />;
      })}
      <circle r={r * 0.5} fill="rgba(255,210,80,0.95)" />
    </svg>
  );
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

const WeatherIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 19a4 4 0 1 1 0-8 1 1 0 0 1 0-.08A4.5 4.5 0 1 1 13.5 15H6z" fill="rgba(180,220,255,0.5)" stroke="rgba(180,220,255,0.7)" strokeWidth="1" />
    <line x1="8" y1="20" x2="7" y2="22" stroke="rgba(120,180,255,0.9)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="12" y1="20" x2="11" y2="22" stroke="rgba(120,180,255,0.9)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="16" y1="20" x2="15" y2="22" stroke="rgba(120,180,255,0.9)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const SunIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="4" fill="rgba(255,210,80,0.95)" />
    <line x1="12" y1="2" x2="12" y2="5" stroke="rgba(255,210,80,0.9)" strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="19" x2="12" y2="22" stroke="rgba(255,210,80,0.9)" strokeWidth="2" strokeLinecap="round" />
    <line x1="2" y1="12" x2="5" y2="12" stroke="rgba(255,210,80,0.9)" strokeWidth="2" strokeLinecap="round" />
    <line x1="19" y1="12" x2="22" y2="12" stroke="rgba(255,210,80,0.9)" strokeWidth="2" strokeLinecap="round" />
    <line x1="4.9" y1="4.9" x2="7.1" y2="7.1" stroke="rgba(255,210,80,0.9)" strokeWidth="2" strokeLinecap="round" />
    <line x1="16.9" y1="16.9" x2="19.1" y2="19.1" stroke="rgba(255,210,80,0.9)" strokeWidth="2" strokeLinecap="round" />
    <line x1="4.9" y1="19.1" x2="7.1" y2="16.9" stroke="rgba(255,210,80,0.9)" strokeWidth="2" strokeLinecap="round" />
    <line x1="16.9" y1="7.1" x2="19.1" y2="4.9" stroke="rgba(255,210,80,0.9)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const MoonIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="rgba(200,180,255,0.8)" stroke="rgba(200,180,255,0.5)" strokeWidth="1" />
  </svg>
);

const SunriseIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="12" y1="2" x2="12" y2="6" stroke="rgba(255,210,80,0.9)" strokeWidth="2" strokeLinecap="round" />
    <line x1="4.9" y1="4.9" x2="7.1" y2="7.1" stroke="rgba(255,210,80,0.9)" strokeWidth="2" strokeLinecap="round" />
    <line x1="2" y1="12" x2="5" y2="12" stroke="rgba(255,210,80,0.9)" strokeWidth="2" strokeLinecap="round" />
    <line x1="19" y1="12" x2="22" y2="12" stroke="rgba(255,210,80,0.9)" strokeWidth="2" strokeLinecap="round" />
    <line x1="16.9" y1="7.1" x2="19.1" y2="4.9" stroke="rgba(255,210,80,0.9)" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="13" r="3.5" fill="rgba(255,210,80,0.95)" />
    <line x1="3" y1="19" x2="21" y2="19" stroke="rgba(255,210,80,0.5)" strokeWidth="1.5" strokeLinecap="round" />
    <polyline points="9,16 12,12 15,16" stroke="rgba(255,210,80,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const SunsetIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="12" y1="2" x2="12" y2="6" stroke="rgba(255,160,60,0.9)" strokeWidth="2" strokeLinecap="round" />
    <line x1="4.9" y1="4.9" x2="7.1" y2="7.1" stroke="rgba(255,160,60,0.9)" strokeWidth="2" strokeLinecap="round" />
    <line x1="2" y1="12" x2="5" y2="12" stroke="rgba(255,160,60,0.9)" strokeWidth="2" strokeLinecap="round" />
    <line x1="19" y1="12" x2="22" y2="12" stroke="rgba(255,160,60,0.9)" strokeWidth="2" strokeLinecap="round" />
    <line x1="16.9" y1="7.1" x2="19.1" y2="4.9" stroke="rgba(255,160,60,0.9)" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="13" r="3.5" fill="rgba(255,160,60,0.95)" />
    <line x1="3" y1="19" x2="21" y2="19" stroke="rgba(255,160,60,0.5)" strokeWidth="1.5" strokeLinecap="round" />
    <polyline points="9,13 12,17 15,13" stroke="rgba(255,160,60,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const MoonriseIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 10.79A7 7 0 1 1 9.21 2 5.5 5.5 0 0 0 18 10.79z" fill="rgba(200,180,255,0.8)" stroke="rgba(200,180,255,0.5)" strokeWidth="1" />
    <line x1="3" y1="19" x2="21" y2="19" stroke="rgba(200,180,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
    <polyline points="9,17 12,13 15,17" stroke="rgba(200,180,255,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const MoonsetIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 10.79A7 7 0 1 1 9.21 2 5.5 5.5 0 0 0 18 10.79z" fill="rgba(200,180,255,0.8)" stroke="rgba(200,180,255,0.5)" strokeWidth="1" />
    <line x1="3" y1="19" x2="21" y2="19" stroke="rgba(200,180,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
    <polyline points="9,14 12,18 15,14" stroke="rgba(200,180,255,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const PlanetIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="5" fill="rgba(150,220,180,0.5)" stroke="rgba(150,220,180,0.8)" strokeWidth="1" />
    <ellipse cx="12" cy="12" rx="11" ry="4" stroke="rgba(150,220,180,0.6)" strokeWidth="1.2" fill="none" transform="rotate(-20 12 12)" />
  </svg>
);

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
  const navigate = useNavigate();
  const today = new Date();
  const { geoData, hasGeoData } = useGeoLocation();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [calendarCells, setCalendarCells] = useState([]);
  const [modal, setModal] = useState({ type: null, data: null });
  const [dayData, setDayData] = useState({ loading: false, weather: null, sunEvents: null, moonEvents: null });
  const [bodyPositions, setBodyPositions] = useState(null);
  const [liveTime, setLiveTime] = useState(new Date());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    setIsAuthenticated(AuthenticationService.isAuthenticated());
  }, []);

  useEffect(() => {
    if (!AuthenticationService.isAuthenticated()) return;
    BookmarkService.GetAuthUserBookmarks()
      .then((data) => setBookmarks(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Failed to load bookmarks:", err));
  }, []);

  useEffect(() => {
    const t = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const buildCalendarCells = (month, year) => {
    const cells = [];
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();

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

    // Stamp bookmarks that fall in this month/year onto their calendar day
    if (bookmarks.length > 0) {
      cells.forEach((cell) => {
        if (cell.variant === "inactive" || !cell.events) return;
        const cellDate = new Date(year, month, cell.day);
        const cellStart = new Date(year, month, cell.day, 0, 0, 0, 0).getTime();
        const cellEnd   = new Date(year, month, cell.day, 23, 59, 59, 999).getTime();
        bookmarks.forEach((bm) => {
          const bmTime = Number(bm.date);
          if (!isNaN(bmTime) && bmTime >= cellStart && bmTime <= cellEnd) {
            cell.events.push({ text: bm.displayName || "Bookmark", color: "primary" });
          }
        });
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
  }, [currentMonth, currentYear, bookmarks]);

  useEffect(() => {
    if (modal.type !== "day" || !modal.data || !hasGeoData || !geoData) return;

    const { day, month, year } = modal.data;
    const date = new Date(year, month, day, 12, 0, 0);

    setDayData({ loading: true, weather: null, sunEvents: null, moonEvents: null });

    const todayMidnight = new Date(); todayMidnight.setHours(0, 0, 0, 0);
    const dateMidnight = new Date(year, month, day, 0, 0, 0);
    const daysDiff = Math.round((dateMidnight - todayMidnight) / (1000 * 60 * 60 * 24));
    const withinForecastWindow = daysDiff >= 0 && daysDiff <= 10;

    const locKey = `${parseFloat(geoData.latitude).toFixed(4)}:${parseFloat(geoData.longitude).toFixed(4)}`;
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const wKey = `weather:${locKey}:${dateStr}`;
    const sKey = `sun:${locKey}:${dateStr}`;
    const mKey = `moon:${locKey}:${dateStr}`;

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
          : AstronomyBodiesInterface.FetchEventsOnDate({ bodyid: "sun", latitude: geoData.latitude, longitude: geoData.longitude, elevation: geoData.elevation ?? 0, date }),
        cM !== undefined
          ? Promise.resolve(cM)
          : AstronomyBodiesInterface.FetchEventsOnDate({ bodyid: "moon", latitude: geoData.latitude, longitude: geoData.longitude, elevation: geoData.elevation ?? 0, date }),
      ]);

      const weather = weatherResult.status === "fulfilled" ? weatherResult.value : null;
      const sunEvents = sunResult.status === "fulfilled" ? sunResult.value : null;
      const moonEvents = moonResult.status === "fulfilled" ? moonResult.value : null;

      if (withinForecastWindow && cW === undefined && weather !== null) _setCache(wKey, weather);
      if (cS === undefined && sunEvents !== null) _setCache(sKey, sunEvents);
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

    const now = new Date();
    const untill = new Date(now);
    untill.setDate(untill.getDate() + 10);

    AstronomyBodiesInterface.FetchAllBodyPositions({
      longitude: geoData.longitude,
      latitude: geoData.latitude,
      elevation: geoData.elevation ?? 0,
      now,
      untill,
    }).then((data) => {
      if (data) { _setCache(posKey, data); setBodyPositions(data); }
    });
  }, [hasGeoData, geoData]);

  const { day: selDay, month: selMonth, year: selYear } = modal.data ?? {};
  const selectedDate = modal.data ? new Date(selYear, selMonth, selDay) : null;
  const moonPhaseData = selectedDate ? getMoonPhaseData(selectedDate) : null;
  const _todayMid = new Date(); _todayMid.setHours(0, 0, 0, 0);
  const _selMid = selectedDate ? new Date(selYear, selMonth, selDay, 0, 0, 0) : null;
  const _selDaysDiff = _selMid ? Math.round((_selMid - _todayMid) / 864e5) : null;
  const withinForecastWindow = _selDaysDiff !== null ? (_selDaysDiff >= 0 && _selDaysDiff <= 10) : false;
  const withinPositionWindow = _selDaysDiff !== null ? (_selDaysDiff >= 0 && _selDaysDiff <= 10) : false;

  const sunEvents = dayData.sunEvents?.data?.rows?.[0]?.events ?? [];
  const moonEvents = dayData.moonEvents?.data?.rows?.[0]?.events ?? [];

  return (
    <div className="page-root">
      <nav className="top-nav">
        <div className="galileo-logo font-headline fw-bold fs-4">Galileo</div>
        <div className="d-none d-md-flex align-items-center gap-4">
          <Link to="/home" className="nav-link-item">Home</Link>
          <Link to="/explore" className="nav-link-item">Explore</Link>
          <Link to="/calendar" className="nav-link-item active">Calendar</Link>
          <Link to="/bookmarks" className="nav-link-item">Bookmarks</Link>
        </div>
        <div className="d-flex align-items-center gap-3">
          {!isAuthenticated && <button className="btn-warp btn-warp-sm" onClick={() => navigate("/login")}>Login</button>}
          <button className="icon-btn"><span className="material-symbols-outlined">account_circle</span></button>
        </div>
      </nav>

      <aside className="sidebar d-none d-lg-flex flex-column">
        <div className="sidebar-inner">
          <div className="galileo-logo font-headline fw-black mb-1">Galileo</div>
          <div className="sidebar-section-label">Navigation</div>
          <nav className="d-flex flex-column gap-1">
            {NAV_ITEMS.map((item) => (
              <Link key={item.label} to={item.path} className={`sidebar-link ${item.active ? "active" : ""}`}>
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="sidebar-footer">
          <button className="sidebar-new-obs-btn">New Observation</button>
        </div>
      </aside>

      <main className="page-main">
        <div className="page-content">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h1 className="font-headline fw-bold page-title mb-1">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </h1>
              <p className="page-subtitle mb-0">
                {liveTime.toLocaleDateString([], { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                {" || "}
                {liveTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </p>
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

      {modal.type && (
        <div className="modal-overlay" onClick={() => setModal({ type: null, data: null })}>
          <div className="cal-modal-content" onClick={(e) => e.stopPropagation()}>

            {modal.type === "day" && (
              <>
                <div className="mb-4" style={{ textAlign: "center" }}>
                  <h2 className="font-headline fw-bold mb-0">
                    {MONTH_NAMES[selMonth]} {selDay}, {selYear}
                  </h2>
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
                      <div className="mb-1"><WeatherIcon size={22} /></div>
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
                      {(() => {
                        const rise = sunEvents.find(ev => ev.type === "rise");
                        const set = sunEvents.find(ev => ev.type === "set");
                        return (rise || set) ? (
                          <div className="d-flex flex-column gap-1 mb-2">
                            {rise && (
                              <div style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                <SunriseIcon size={16} /><span>Sunrise: <strong>{formatTime(rise.time)}</strong></span>
                              </div>
                            )}
                            {set && (
                              <div style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                <SunsetIcon size={16} /><span>Sunset: <strong>{formatTime(set.time)}</strong></span>
                              </div>
                            )}
                          </div>
                        ) : null;
                      })()}
                      {sunEvents.filter(ev => ev.type !== "rise" && ev.type !== "set").length > 0 ? (
                        sunEvents.filter(ev => ev.type !== "rise" && ev.type !== "set").map((ev, i) => (
                          <div key={i} style={{ fontSize: "0.85rem", marginBottom: "0.25rem" }}>
                            {SUN_EVENT_LABELS[ev.type] ?? ev.type}: <strong>{formatTime(ev.time)}</strong>
                          </div>
                        ))
                      ) : sunEvents.length === 0 ? (
                        <p className="page-subtitle mb-0" style={{ fontSize: "0.8rem" }}>No events found.</p>
                      ) : null}
                      <div className="d-flex justify-content-center mt-3">
                        <SunVisual size={72} />
                      </div>
                    </div>

                    <div className="col-12 col-md-3">
                      <h4 className="font-headline fw-bold mb-2"
                        style={{ fontSize: "0.7rem", letterSpacing: "0.12em", color: "var(--clr-secondary)" }}>
                        MOON
                      </h4>
                      {(() => {
                        const rise = moonEvents.find(ev => ev.type === "rise");
                        const set = moonEvents.find(ev => ev.type === "set");
                        return (rise || set) ? (
                          <div className="d-flex flex-column gap-1 mb-2">
                            {rise && (
                              <div style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                <MoonriseIcon size={16} /><span>Moonrise: <strong>{formatTime(rise.time)}</strong></span>
                              </div>
                            )}
                            {set && (
                              <div style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                <MoonsetIcon size={16} /><span>Moonset: <strong>{formatTime(set.time)}</strong></span>
                              </div>
                            )}
                          </div>
                        ) : null;
                      })()}
                      {moonEvents.filter(ev => ev.type !== "rise" && ev.type !== "set").length > 0 ? (
                        moonEvents.filter(ev => ev.type !== "rise" && ev.type !== "set").map((ev, i) => (
                          <div key={i} style={{ fontSize: "0.85rem", marginBottom: "0.25rem" }}>
                            {MOON_EVENT_LABELS[ev.type] ?? ev.type}: <strong>{formatTime(ev.time)}</strong>
                          </div>
                        ))
                      ) : moonEvents.length === 0 ? (
                        <p className="page-subtitle mb-0" style={{ fontSize: "0.8rem" }}>No events found.</p>
                      ) : null}
                      {moonPhaseData && (
                        <div className="d-flex flex-column align-items-center gap-1 mt-3">
                          <MoonPhaseVisual phase={moonPhaseData.phase} size={72} />
                          <span className="page-subtitle mb-0" style={{ fontSize: "0.7rem", letterSpacing: "0.05em" }}>
                            {moonPhaseData.name}
                          </span>
                        </div>
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
                          <div className="mb-1"><PlanetIcon size={22} /></div>
                          <h4 className="font-headline fw-bold mb-2"
                            style={{ fontSize: "0.7rem", letterSpacing: "0.12em", color: "var(--clr-on-surface-variant)" }}>
                            PLANET POSITIONS
                          </h4>
                          <div className="d-flex flex-wrap gap-4">
                            {filtered.map((row, i) => {
                              const pos = (row.positions ?? []).find(p => typeof p.date === "string" && p.date.startsWith(dateStr));
                              if (!pos) return null;
                              const alt = pos.horizontal?.altitude?.degrees ?? "—";
                              const az = pos.horizontal?.azimuth?.degrees ?? "—";
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

                {(() => {
                  if (!selDay) return null;
                  const cellStart = new Date(selYear, selMonth, selDay, 0, 0, 0, 0).getTime();
                  const cellEnd   = new Date(selYear, selMonth, selDay, 23, 59, 59, 999).getTime();
                  const dayBookmarks = bookmarks.filter((bm) => {
                    const t = Number(bm.date);
                    return !isNaN(t) && t >= cellStart && t <= cellEnd;
                  });
                  if (dayBookmarks.length === 0) return null;
                  return (
                    <div className="mt-4">
                      <h4 className="font-headline fw-bold mb-2"
                        style={{ fontSize: "0.7rem", letterSpacing: "0.12em", color: "var(--clr-primary)" }}>
                        BOOKMARKS
                      </h4>
                      <div className="d-flex flex-column gap-2">
                        {dayBookmarks.map((bm, i) => (
                          <div key={i} className="d-flex align-items-center gap-2"
                            style={{ fontSize: "0.85rem", padding: "0.4rem 0.6rem", borderRadius: "6px",
                              background: "rgba(var(--clr-primary-rgb, 180,120,255),0.08)",
                              border: "1px solid rgba(var(--clr-primary-rgb, 180,120,255),0.2)" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "1rem", color: "var(--clr-primary)" }}>bookmark</span>
                            <span style={{ fontWeight: 600 }}>{bm.displayName || "Bookmark"}</span>
                            {bm.whichAPI && (
                              <span style={{ color: "var(--clr-on-surface-variant)", fontSize: "0.75rem", marginLeft: "auto" }}>
                                {bm.whichAPI}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

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