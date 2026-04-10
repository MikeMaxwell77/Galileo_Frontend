import { useState } from "react";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire up to AuthenticationService.js
  };

  return (
    <div className="bg-nebula" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div className="glow-orb-left" />
      <div className="glow-orb-right" />

      <header className="position-fixed top-0 w-100 d-flex justify-content-between align-items-center px-4 py-4" style={{ zIndex: 50 }}>
        <div className="font-headline fw-bold fs-4 galileo-logo">Galileo</div>
      </header>

      <main className="container" style={{ maxWidth: "1100px" }}>
        <div className="row align-items-center g-5">

          <div className="col-md-6 d-none d-md-flex flex-column gap-4">
            <span className="font-headline fw-bold section-eyebrow">Celestial Cartography</span>
            <h1 className="font-headline fw-bold hero-heading">
              Map the <br />
              <span className="text-gradient">Unseen Universe</span>
            </h1>
            <p className="hero-subtext">
              Join the league of cosmic observers. Document anomalies, track orbital patterns, and archive the infinity.
            </p>
          </div>

          <div className="col-md-6 d-flex justify-content-center justify-content-lg-end">
            <div className="glass-panel p-4 p-md-5 position-relative" style={{ width: "100%", maxWidth: "440px" }}>

              <div className="d-flex gap-4 mb-4 tab-row">
                <button className={`tab-btn ${activeTab === "login" ? "active" : ""}`} onClick={() => setActiveTab("login")}>Login</button>
                <button className={`tab-btn ${activeTab === "register" ? "active" : ""}`} onClick={() => setActiveTab("register")}>Register</button>
              </div>

              <div className="mb-4">
                <h2 className="font-headline fw-bold mb-1" style={{ fontSize: "1.4rem" }}>
                  {activeTab === "login" ? "Welcome Back, Voyager" : "Begin Your Journey"}
                </h2>
                <p className="form-subtext">
                  {activeTab === "login" ? "Enter your credentials to access the bridge." : "Create your account to join the observatory."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
                <div>
                  <label className="field-label d-block">Navigation</label>
                  <div className="position-relative">
                    <span className="material-symbols-outlined input-icon">alternate_email</span>
                    <input type="email" className="galileo-input form-control" placeholder="voyager@galileo.sys" />
                  </div>
                </div>

                <div>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="field-label">Access Code</label>
                    {activeTab === "login" && <a href="#" className="lost-code-link">Lost Code?</a>}
                  </div>
                  <div className="position-relative">
                    <span className="material-symbols-outlined input-icon">lock</span>
                    <input type={showPassword ? "text" : "password"} className="galileo-input form-control" placeholder="••••••••••••" />
                    <span className="material-symbols-outlined input-icon-right" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </div>
                </div>

                <button type="submit" className="btn-warp mt-2 d-flex align-items-center justify-content-center gap-2">
                  {activeTab === "login" ? "Initiate Warp" : "Launch Sequence"}
                  <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>rocket_launch</span>
                </button>
              </form>

              <div className="card-corner-glow" />
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto py-4 w-100 d-flex flex-column align-items-center gap-3">
        <div className="d-flex gap-4">
          <a href="#" className="footer-link">Privacy Protocol</a>
          <a href="#" className="footer-link">Terms of Orbit</a>
          <a href="#" className="footer-link">Support Relay</a>
        </div>
        <div className="footer-copyright">© 2024 Galileo Interstellar Systems • v4.0.2-Stable</div>
      </footer>
    </div>
  );
}