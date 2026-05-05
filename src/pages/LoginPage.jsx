import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import AuthenticationService from "../auth/AuthenticationService";
import SiteFooter from "../components/SiteFooter";

export default function LoginPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);

  // data for jason
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (activeTab === "login") {
        // Login
        const token = await AuthenticationService.Login(email, password)

        if (!token || token.split(".").length !== 3) {
              throw new Error("Invalid token format");
        }

        AuthenticationService.LoginToken(token);
        setMessage("Login Successful");
        navigate("/home");
      }
      else { // Register
        await AuthenticationService.Register(email, password);
        setMessage("Registration Successful");
        setActiveTab("login");
      }
    } catch (error) {
      console.error("AUTH ERROR:", error.response?.data || error.message);
      if (activeTab === "login") {
        setMessage("Login failed. Please check your credentials.");
      } else {
        setMessage("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    const Authenticated = AuthenticationService.isAuthenticated();

    if (Authenticated) {
      navigate("/home");
    }
  }, [])

  return (
    <div className="bg-nebula login-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div className="glow-orb-left" />
      <div className="glow-orb-right" />

      <header className="position-fixed top-0 w-100 d-flex justify-content-between align-items-center px-3 px-md-4 py-3 py-md-4" style={{ zIndex: 1 }}>
        <Link to="/" className="font-headline fw-bold fs-4 galileo-logo text-decoration-none">Galileo</Link>
      </header>

      <main className="container py-5" style={{ maxWidth: "1100px" }}>
        <div className="row align-items-center g-4 g-lg-5">

          {/* Left Column: Hero Text */}
          <div className="col-lg-6 d-none d-lg-flex flex-column gap-4">
            <span className="font-headline fw-bold section-eyebrow">Celestial Cartography</span>
            <h1 className="font-headline fw-bold hero-heading">
              Map the <br />
              <span className="text-gradient">Unseen Universe</span>
            </h1>
            <p className="hero-subtext">
              Join the league of cosmic observers. Document anomalies, track orbital patterns, and archive the infinity.
            </p>
          </div>

          {/* Right Column: Glass Form */}
          <div className="col-12 col-lg-6 d-flex justify-content-center justify-content-lg-end">
            <div className="glass-panel p-3 p-md-5 position-relative" style={{ width: "100%", maxWidth: "440px" }}>

              <div className="d-flex gap-4 mb-4 tab-row">
                <button 
                  className={`tab-btn ${activeTab === "login" ? "active" : ""}`} 
                  onClick={() => { setActiveTab("login"); setMessage(""); }}
                >
                  Login
                </button>
                <button 
                  className={`tab-btn ${activeTab === "register" ? "active" : ""}`} 
                  onClick={() => { setActiveTab("register"); setMessage(""); }}
                >
                  Register
                </button>
              </div>

              <div className="mb-4">
                <h2 className="font-headline fw-bold mb-1" style={{ fontSize: "1.4rem" }}>
                  {activeTab === "login" ? "Welcome Back, Voyager" : "Begin Your Journey"}
                </h2>
                <p className="form-subtext">
                  {activeTab === "register" ? "Enter your credentials to access the bridge." : "Create your account to join the observatory."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
                <div>
                  <label className="field-label d-block">Navigation</label>
                  <div className="position-relative">
                    <span className="material-symbols-outlined input-icon">alternate_email</span>
                    <input 
                      type="email" 
                      className="galileo-input form-control" 
                      placeholder="voyager@galileo.sys"
                      value={email} // Controlled input
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                <div>
                  {/*
                  {<div className="d-flex justify-content-between align-items-center mb-1">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="field-label">Access Code</label>
                    {activeTab === "login" && <a href="#" className="lost-code-link">Lost Code?</a>}
                  </div>
                  */}
                  <div className="position-relative">
                    <span className="material-symbols-outlined input-icon">lock</span>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className="galileo-input form-control" 
                      placeholder="••••••••••••"
                      value={password} // Controlled input
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                    />
                    <span 
                      className="material-symbols-outlined input-icon-right" 
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </div>
                </div>

                {message && (
                  <p style={{ fontSize: "0.9rem", color: message.includes("Successful") ? "#4ade80" : "#f87171" }}>
                    {message}
                  </p>
                )}

                <button type="submit" disabled={loading} className="btn-warp mt-2 d-flex align-items-center justify-content-center gap-2">
                  {loading ? "Processing..." : (activeTab === "login" ? "Initiate Warp" : "Launch Sequence")}
                  {!loading && <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>rocket_launch</span>}
                </button>
              </form>

              <div className="card-corner-glow" />
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}