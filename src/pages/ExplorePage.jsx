import { useEffect, useState, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ExplorePage.css";

import { AstronomyBodiesInterface, AstronomySearchInterface } from './../astronomyAPI/BodiesApi'
import { useGeoLocation } from "./../components/geoLocation/GeoLocation";
import AuthenticationService from "../auth/AuthenticationService";

import ExplorePageEvent from "../components/DataViews/ExplorePageEvent";
import BookmarkService from "../GalileoBackendServices/BookmarksService";
import { SatelliteInterface } from "../GalileoBackendServices/nasaSatelliteService.js";




const SIGNALS = [
  { id: 1, icon: "rocket_launch", iconColor: "var(--clr-primary)", glowColor: "rgba(224,142,254,0.05)", title: "Stellar Documentation", desc: "A curated repository of technical specifications for warp drive maintenance and navigation.", tags: [{ label: "Archive", color: "var(--clr-secondary)", border: "rgba(186,146,250,0.2)" }, { label: "Active", color: "var(--clr-tertiary)", border: "rgba(255,231,146,0.2)" }], scanned: "0.4s ago", saved: true },
  { id: 2, icon: "database", iconColor: "var(--clr-secondary)", glowColor: "rgba(186,146,250,0.05)", title: "Nebula Core API", desc: "Connect your observation deck directly to the central nebula data stream for real-time tracking.", tags: [{ label: "Developer", color: "var(--clr-secondary)", border: "rgba(186,146,250,0.2)" }, { label: "API", color: "var(--clr-primary)", border: "rgba(224,142,254,0.2)" }], scanned: "1.2h ago", saved: false },
  { id: 3, icon: "public", iconColor: "var(--clr-primary)", glowColor: "rgba(224,142,254,0.05)", title: "Exoplanet Registry", desc: "Detailed biological and geological scans of newly discovered habitable worlds in the Goldilocks zone.", tags: [], scanned: "4h ago", saved: false },
  { id: 4, icon: "auto_awesome", iconColor: "var(--clr-secondary)", glowColor: "rgba(186,146,250,0.05)", title: "Quantum Frameworks", desc: "Next-gen code structures for simulating sub-atomic particle movements in high-density nebulae.", tags: [], scanned: "15m ago", saved: false },
];

const NAV_ITEMS = [
  { label: "Home", icon: "space_dashboard", path: "/home" },
  { label: "Explore", icon: "explore", path: "/explore", active: true },
  { label: "Calendar", icon: "calendar_month", path: "/calendar" },
  { label: "Bookmarks", icon: "bookmarks", path: "/bookmarks" },
  { label: "Account", icon: "person", path: "/account" },
];

export default function ExplorePage() {
  const { geoData, geoAPIDenied, hasGeoData, getLocation, checkGeoAutoAPI, setManualLocation } = useGeoLocation();
  const navigate = useNavigate();

  const [bookmarks, setBookmarks] = useState({ 1: true });
  const [query, setQuery] = useState("");

  const [debouncedQuery, setDebouncedQuery] = useState(query);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isLogedIn, setIsLogedIn] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [myBookmarks, setMyBookmarks] = useState([]);
  const bookmarkedSet = useMemo(() => {
    const set = new Set(myBookmarks.map(bm => `${bm.whichAPI}:${bm.API_identifier}`));
    console.log("Bookmark set contents:", set);
    return set;
  }, [myBookmarks]);

  const [reloadMWBStore, setReloadMWBStore] = useState(true);
  const [milkyWayBodies, setMilkyWayBodies] = useState({
    names: null,
    data: null
  })

  const [modal, setModal] = useState({
    type: null,
    data: null
  })

  // nasa API for satallites
  const [satellites, setSatellites] = useState([]);

  const mapSatelliteToEventObj = (sat) => ({
    id: sat.Id,
    title: sat.Name,
    source: "SSC",
    desc: `Satellite · ${sat.StartTime?.slice(0, 4) ?? "?"} – ${sat.EndTime?.slice(0, 4) ?? "present"}`,
    icon: "satellite_alt",
    iconColor: "var(--clr-tertiary)",
    glowColor: "rgba(255,231,146,0.05)",
    tags: [{ label: "Satellite", color: "var(--clr-tertiary)", border: "rgba(255,231,146,0.2)" }],
    scanned: sat.StartTime,
    equatorial_pos: null,
  });



  useEffect(() => {
    console.log("Satelite use effect fired")
    const loadSatellites = async () => {
      try {
        const res = await SatelliteInterface.FetchAllSatellites();
        console.log("Satellites loaded:", res.length);     // does this fire at all?
        console.log("Sample:", res[0]);
        const mapped = res.map(mapSatelliteToEventObj);
        console.log("Mapped satellites:", mapped.length);
        console.log("Sample mapped satellite:", mapped[0]);
        setSatellites(mapped);
      } catch (err) {
        console.error("Failed to load satellites", err);
      }
    };
    loadSatellites();
  }, []);

  const toggleBookmark = async (sig) => {
    if (!AuthenticationService.isAuthenticated()) {
      setModal({ type: "login", data: null });
      return;
    }

    const bookmarkKey = `${sig.source}:${sig.id}`;
    const isCurrentlySaved = bookmarkedSet.has(bookmarkKey);
    const savedBookmark = myBookmarks.find(
      bm => `${bm.whichAPI}:${bm.API_identifier}` === bookmarkKey
    );

    try {
      if (isCurrentlySaved && savedBookmark) {
        await BookmarkService.DeleteBookmarkByID(savedBookmark.id);
      } else {
        console.log(sig)

        await BookmarkService.CreateNewBookmark({
          objectAPIIdentifier: sig.id,
          whichAPI: sig.source || "error api identifier",
          displayName: sig.title,
          latitude: geoData.latitude,
          longitude: geoData.longitude
        });
      }
      await loadBookmarks();
    } catch (err) {
      console.error("Bookmark failed", err);
    }
  };

  const handleManualSubmit = (lat, long, elev) => {
    setManualLocation(lat, long, elev);

    //setGeoAPIDenied(false); // user recovered

  };

  const handleLogin = () => {
    navigate("/login");
  }

  const handleAccountSymbol = () => {
    navigate("/account")
  }



  const TryLogin = async () => {
    setLoginFailed(false);
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await AuthenticationService.Login(email, password);

      if (res) {
        setIsLogedIn(true);
        setModal({ type: null, data: null });
      } else {

      }
    } catch (err) {
      console.error("Login failed", err);
      setLoginFailed(true);
    }
  }

  const setEventIcon = (type_id) => {
    switch (type_id) {
      //https://icons.getbootstrap.com/ 
      default:
        return "Star"
      case "STRss":
        return "Star"
      case "SNRss":
        //"Super Nova Remnant";
        return "Starburst";
      case "Gss":
        //"Galaxy"
        return "Sparkly"
    }
  }

  const mapAstronomySearchResToEventObj = (obj) => {
    return {
      source: "AstronomyAPI",
      id: obj.id,
      title: obj.name,
      desc: `${obj.type.name} in ${obj.position.constellation.name ? obj.position.constellation.name : "n/a"}`,
      icon: setEventIcon(obj.type.id),
      searchobj: true,

      equatorial_pos: obj.position.equatorial,
      crossIdentification: obj.crossIdentification,

      iconColor: "var(--clr-primary)",
      glowColor: "rgba(224,142,254,0.05)",
      tags: [
        {
          label: obj.type.name,
          color: "var(--clr-secondary)",
          border: "rgba(186,146,250,0.2)"
        },
        ...(obj.subType?.name
          ? [{
            label: obj.subType.name,
            color: "var(--clr-tertiary)",
            border: "rgba(255,231,146,0.2)"
          }]
          : [])
      ],
      scanned: obj.position.equatorial.rightAscension.string

    }
  }

  const preprocessRow = (row) => {
    const latest = row.cells[0]; // or pick latest properly later

    return {
      entry: row.entry,
      latest: latest,
      date: latest.date,
      position: latest.position,
      extraInfo: latest.extraInfo
    };
  };

  const mapAstronomyBoidesResToEventObj = (obj) => {
    return {
      source: "AstronomyAPI",
      id: obj.entry.id,
      title: obj.entry.name,
      searchobj: true,

      desc: `${obj.latest.position.constellation.name}`,

      icon: "public", // you can improve this later
      iconColor: "var(--clr-primary)",
      glowColor: "rgba(224,142,254,0.05)",

      scanned: obj.date,

      equatorial_pos: obj.position.equatorial,
      // useful extra data
      position: obj.position,
      magnitude: obj.extraInfo?.magnitude
    };
  }

  const normalizeString = (str) => str.toLowerCase().trim();

  const requestIdRef = useRef(0); // to stop overwriting when searching
  useEffect(() => {
    if (!query) return;
    if (!events) setLoading(true);
    if (!debouncedQuery) return;


    const currentRequest = ++requestIdRef.current;

    const searchForObjects = async () => {
      try {
        const response = await AstronomySearchInterface.FetchObjectsByName(
          {
            objectSearchTerm: debouncedQuery.toString(),
            exact: false
          }
        )

        if (currentRequest != requestIdRef.current) return;
        if (!currentRequest) return;

        // Should also check against the ones in the bodies api and return them if its a match

        const mapped = response.data.map(mapAstronomySearchResToEventObj);
        let milkyMatches = [];
        if (milkyWayBodies.data) {
          milkyMatches = milkyWayBodies.data.filter(
            body => normalizeString(body.title).includes(normalizeString(debouncedQuery))
          );
        }

        const satMatches = satellites.filter(
          sat => normalizeString(sat.title).includes(normalizeString(debouncedQuery))
        );

        const combined = [...mapped, ...milkyMatches, ...satMatches];
        console.log("satellites state at search time:", satellites.length);
        console.log("query:", debouncedQuery);
        console.log("satMatches:", satMatches);
        setEvents(combined);

        //console.log(combined);
      } catch (error) {
        console.error("Search for object api request failed:", error);
      } finally {
        if (currentRequest == requestIdRef.current) {
          setLoading(false);
        }

      }
    }

    searchForObjects();

  }, [debouncedQuery, satellites])

  useEffect(() => {
    // Will only be possible if the user has their location shared
    if (!hasGeoData) return;

    const fetchBodies = async () => {
      let bodyNames = [];
      let bodyPositionEvents = null;

      // Fetch names
      try {
        const res = await AstronomyBodiesInterface.FetchNamedBodies();
        bodyNames = res.data.bodies;
      } catch (err) {
        console.error("Failed to fetch body names", err);
      }

      // Fetch positions
      try {
        const res = await AstronomyBodiesInterface.FetchAllBodyPositionsWFN({
          latitude: geoData.latitude,
          longitude: geoData.longitude,
          elevation: geoData.elevation
        });

        bodyPositionEvents = res.data.table.rows.map(preprocessRow).map(mapAstronomyBoidesResToEventObj);
      } catch (err) {
        console.error("Failed to fetch body positions", err);
      }

      //console.log(bodyNames);
      //console.log(bodyPositionEvents);
      setMilkyWayBodies({
        names: bodyNames,
        data: bodyPositionEvents
      });
    }

    fetchBodies()

  }, [hasGeoData, reloadMWBStore])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);

    return () => clearTimeout(timeout);
  }, [query])

  useEffect(() => {
    console.log("Initial init effect")
    const checkAuthenticated = async () => {
      if (AuthenticationService.isAuthenticated()) {
        console.log("Authenticated user");
        setIsLogedIn(true);
      }
    }

    checkAuthenticated();


  }, [])

  const loadBookmarks = async () => {
    try {
      const res = await BookmarkService.GetAuthUserBookmarks();
      console.log(res);
      console.log("First Bookmark:", res?.[0]);
      if (res) setMyBookmarks(res);

    } catch (error) {
      console.error("Failed to load bookmarks", err);
    }
  }

  useEffect(() => {


    if (isLogedIn) {
      loadBookmarks()
      console.log(myBookmarks);
    }
  }, [isLogedIn])

  return (
    <div className="page-root">
      <nav className="top-nav">
        <div className="galileo-logo font-headline fw-bold fs-4">Galileo</div>
        <div className="d-none d-md-flex align-items-center gap-4">
          <Link to="/home" className="nav-link-item">Home</Link>
          <Link to="/explore" className="nav-link-item active">Explore</Link>
          <Link to="/calendar" className="nav-link-item">Calendar</Link>
          <Link to="/bookmarks" className="nav-link-item">Bookmarks</Link>
        </div>
        <div className="d-flex align-items-center gap-3">
          {!isLogedIn && <button className="btn-warp btn-warp-sm" onClick={() => navigate("/login")}>Login</button>}
          <button className="icon-btn" onClick={() => handleAccountSymbol()}><span className="material-symbols-outlined">account_circle</span></button>
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
          <header className="mb-5">
            <h1 className="font-headline fw-bold page-title">
              Explore the <span className="text-gradient">Void</span>
            </h1>
            <p className="page-subtitle">
              Scan the digital cosmos for bookmarks, data nodes, and celestial coordinates. Discover what others have charted in the infinite expanse.
            </p>
          </header>

          <div className="row g-3 mb-5">
            <div className="col-12 col-md-8">
              <div className="search-wrapper">
                <div className="search-box">
                  <span className="material-symbols-outlined search-icon">search</span>
                  <input className="search-input" type="text" placeholder="Search the nebula for websites, tags, or users..." value={query} onChange={(e) => setQuery(e.target.value)} />
                  <button className="btn-scan" onClick={() => setQuery(query)}>SCAN</button>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <button className="share-btn" onClick={() => setModal({ type: "location", data: null })}>
                <span className="material-symbols-outlined">share_location</span>
                <span className="font-headline fw-bold">{hasGeoData ? "VIEW" : "SHARE"} LOCATION</span>
              </button>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-baseline mb-4">
            <h2 className="font-headline fw-bold section-heading">Recent Signals</h2>
            <span className="results-count">{events.length} objects found</span>
          </div>

          <div className="row g-4">
            {events.length > 0 && events.map((sig) => (
              <div key={sig.id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                <ExplorePageEvent
                  data={sig}
                  isSaved={bookmarkedSet.has(`${sig.source}:${sig.id}`)}
                  onToggleBookmark={toggleBookmark}
                  onOpen={() => setModal({ type: "event", data: sig })}
                />
              </div>
            ))}
          </div>

        </div>
      </main>

      <div className="mobile-nav-bar d-lg-none">
        <button className="mobile-nav-btn"><span className="material-symbols-outlined">space_dashboard</span></button>
        <button className="mobile-nav-btn active"><span className="material-symbols-outlined">explore</span></button>
        <button className="mobile-nav-btn"><span className="material-symbols-outlined">calendar_month</span></button>
        <button className="mobile-nav-btn"><span className="material-symbols-outlined">bookmarks</span></button>
      </div>

      {/* MODAL - the popup if something is interacted with*/}
      {modal.type && (
        <div className="modal-overlay" onClick={() => setModal({ type: null, data: null })}>

          <div className="modal-content" onClick={(e) => e.stopPropagation()}>

            {/* EVENT MODAL */}
            {modal.type === "event" && (
              <>
                <div>
                  <h1 className="text-center">{modal.data.title}</h1>
                  <h3 className="text-center">{modal.data.desc}</h3>
                </div>



                <div className="d-flex gap-2 mb-3">

                  {modal.data.tags?.map(tag => (
                    <span key={tag.label}>{tag.label}</span>
                  ))}
                </div>


                <p><strong>Scanned:</strong> {modal.data.scanned}</p>

                {/*Guard for satellites which have no equatorial position */}
                {modal.data.equatorial_pos ? (
                  <div>
                    <h4><strong>Equatorial Position Data</strong></h4>
                    <p>Declination: {modal.data.equatorial_pos.declination.string}</p>
                    <p>RightAscension: {modal.data.equatorial_pos.rightAscension.string}</p>
                  </div>
                ) : (
                  <div>
                    <h4><strong>Orbital Object</strong></h4>
                    <p>Source: NASA Satellite Situation Center</p>
                    <p>Trajectory data available from {modal.data.scanned?.slice(0, 10)}</p>
                  </div>
                )}

                <div className="d-flex gap-2 mt-3">
                  <button className="btn-warp" onClick={() => setModal({ type: null, data: null })}>
                    Cancel | Close
                  </button>
                </div>
              </>
            )}


            {/* LOCATION MODAL */}
            {modal.type === "location" && (
              <>
                <h2>Share Location</h2>
                <p>Enter your location manually or enable browser location access.</p>

                {(!hasGeoData && !geoAPIDenied) && <button className="btn btn-primary" onClick={checkGeoAutoAPI}>Get GeoLocation Data</button>}

                {!hasGeoData && geoAPIDenied && (
                  <div>
                    <input id="lat" placeholder="Latitude" type="number" />
                    <input id="long" placeholder="Longitude" type="number" />
                    <input id="elev" placeholder="Elevation" type="number" />

                    <button className="btn-warp"
                      onClick={() =>
                        handleManualSubmit(
                          document.getElementById("lat").value,
                          document.getElementById("long").value,
                          document.getElementById("elev").value
                        )
                      }
                    >
                      Submit
                    </button>
                  </div>
                )}

                < div className="container mt-4">
                  {!geoAPIDenied ? (
                    <h3>Automatic GeoLocation data</h3>
                  ) : (

                    <h3>Manual GeoLocation data</h3>
                  )
                  }
                </div>

                <div className="container mt-4">
                  {hasGeoData && (
                    <div>
                      <h3>Current GeoLocation Data:</h3>
                      <p>Latitude: {geoData.latitude}</p>
                      <p>Longitude: {geoData.longitude}</p>
                      <p>Elevation: {geoData.elevation}</p>
                      <p>Timestamp: {geoData.createdAt.toString()}</p>
                    </div>
                  )}
                </div>

                <div className="d-flex gap-2 mt-3">
                  <button
                    className="btn-warp"
                    onClick={() => setModal({ type: null, data: null })}
                  >
                    Cancel | Close
                  </button>
                </div>
              </>
            )}

            {/* LOGIN MODAL */}
            {modal.type === "login" && (
              <>
                <h2>Login</h2>

                {loginFailed && (<p className="fw-bold text-danger">Login Failed!</p>)}

                <input id="email" placeholder="email" className="form-control mb-2" />
                <input id="password" type="password" placeholder="Password" className="form-control mb-2" />

                <div className="d-flex gap-2 mt-3">
                  <button
                    className="btn-warp"
                    onClick={async () => TryLogin()}
                  >
                    Login
                  </button>

                  <button
                    className="btn-warp"
                    onClick={() => setModal({ type: null, data: null })}
                  >
                    Cancel
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