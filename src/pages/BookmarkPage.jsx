import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import BookmarkService from "../GalileoBackendServices/BookmarksService";
import AuthenticationService from "../auth/AuthenticationService";
import Navbar from "../components/Navbar";

import { GALILEO_BACKEND_SEARCH_ACCOUNT } from "../GalileoBackendServices/backendPaths"

import jupiterImg from "../assets/jupiter.png";

import "./BookmarkPage.css"

export default function BookmarksPage() {
  const navigate = useNavigate();

  const [modal, setModal] = useState({
    type: null,
    data: null
  })

  const [userSearch, setUserSearch] = useState("");
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const [authenticated, setAuthenticated] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false)

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
      title: bm.displayName.toUpperCase(),
      observer_pos: `${bm.longitude} : ${bm.latitude}`,
      dateStr: new Date(bm.timestamp).toLocaleString(),
      API: bm.whichAPI
    }
  }

  useEffect(() => {
    // Init effect
    setAuthenticated(AuthenticationService.isAuthenticated());


  }, [])

  useEffect(() => {
    if (authenticated) {
      loadMyBookmarks();
    }
  }, [authenticated])

  useEffect(() => {

    if (userSearch.length < 2 || !authenticated) {
      setUserSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await axios.get(
          `${GALILEO_BACKEND_SEARCH_ACCOUNT}?email=${userSearch}`, { headers: AuthenticationService.getAuthHeader() }
        );

        setUserSearchResults(res.data);
        setShowSearchResults(true);
      } catch (err) {
        console.error(err);
      }
    }, 300); // debounce

    return () => clearTimeout(timeout);


  }, [userSearch]);


  const handleDelete = async (id) => {
    try {
      await BookmarkService.DeleteBookmarkByID(id);

      // remove from UI immediately
      setMyBookmarks(prev => prev.filter(bm => bm.id !== id));

    } catch (err) {
      console.error("Failed to delete bookmark", err);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  }

  const TryLogin = async () => {
    setLoginFailed(false);
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await AuthenticationService.Login(email, password);

      if (res) {
        setAuthenticated(true);
        setModal({ type: null, data: null });
      } else {

      }
    } catch (err) {
      console.error("Login failed", err);
      setLoginFailed(true);
    }
  }

  const handleAccountSymbol = () => {
    navigate("/account")
  }

  const handleUserSelect = async (user) => {
    setUserSearch(user.email);
    setShowSearchResults(false);

    try {
      setLoadingOtherBM(true);

      const res = await BookmarkService.GetBookmarks(user.id);
      setOtherBookmarks(res);
    } catch (err) {
      console.error("Failed to load other bookmarks", err);
    } finally {
      setLoadingOtherBM(false);
    }
  };

  const handleYank = async (id) => {
    const bookmark = otherBookmarks.find(bm => bm.id === id)

    if (!bookmark) return;

    try {
      await BookmarkService.CreateNewBookmark({
        objectAPIIdentifier: bookmark.API_identifier,
        whichAPI: bookmark.whichAPI,
        displayName: bookmark.displayName,
        latitude: bookmark.latitude,
        longitude: bookmark.longitude
      });

      // optional: refresh your bookmarks
      loadMyBookmarks();

    } catch (err) {
      console.error("Failed to yank bookmark", err);
    }

  }

  return (
    <div className="page-root planet-bg-root">
      <div
        className="planet-bg"
        style={{ backgroundImage: `url(${jupiterImg})` }}
      />
      <div className="planet-bg-fade" />

      <Navbar active="bookmarks" />

      {/* ── Main ── */}
      <main className="page-main bookmarks-page">

        {/* ── Content ── */}
        <div className="page-content">

          <header className="mb-5">
            <h1 className="font-headline fw-bold page-title mb-0">
              Charted <span className="text-gradient">Constellations</span>
            </h1>
          </header>

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

          {/* No auth display*/}
          {!authenticated && (
            <h2>Log in to view your and other users's bookmars</h2>
          )}

          {/* The users bookmakrs */}
          {authenticated && (
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
                    {myBookmarks && !loadingMyBM && myBookmarks.map((bm) => {
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
                              className="galileo-action-btn danger"
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

          {authenticated && (
            <div className="bookmarks-table-wrap mt-5">
              <div className="table-responsive">
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
                  <h3 className="mb-0">See what other Users have Bookmarked</h3>
                  <div className="position-relative" style={{ maxWidth: "320px", width: "100%" }}>
                    <span className="material-symbols-outlined input-icon">person_search</span>
                    <input
                      className="galileo-input form-control"
                      type="text"
                      placeholder="Search users..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                    />
                    {showSearchResults && userSearchResults.length > 0 && (
                      <div className="search-dropdown">
                        {userSearchResults.map((user) => (
                          <div
                            key={user.email}
                            className="search-item"
                            onClick={() => handleUserSelect(user)}
                          >
                            {user.email}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
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
                    {otherBookmarks && !loadingOtherBM && otherBookmarks.map((bm) => {
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
                              className="galileo-action-btn"
                              onClick={() => handleYank(bm.id)}
                            >
                              Yank!
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



        </div>

        {/* MODAL - the popup if something is interacted with*/}
        {modal.type && (
          <div className="modal-overlay" onClick={() => setModal({ type: null, data: null })}>

            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

              {/* EVENT MODAL -> potential bookmark modal if wanted */}
              {modal.type === "event" && (
                <>
                  <h2>{modal.data.title}</h2>
                  <p>{modal.data.desc}</p>

                  <div className="d-flex gap-2 mb-3">
                    {modal.data.tags?.map(tag => (
                      <span key={tag.label}>{tag.label}</span>
                    ))}
                  </div>

                  <p><strong>Scanned:</strong> {modal.data.scanned}</p>
                  <div>
                    <h4><strong>Equatorial Position Data</strong></h4>
                    <p>Declination: {modal.data.equatorial_pos.declination.string}</p>
                    <p>RightAscension: {modal.data.equatorial_pos.rightAscension.string}</p>
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
      </main>
    </div>
  );
}