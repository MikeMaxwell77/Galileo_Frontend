import Navbar from "../components/Navbar";
import "./BookmarkPage.css";
import jupiterImg from "../assets/jupiter.png";

const NASA_EYES_URL = `https://eyes.nasa.gov/apps/solar-system/#/home?rate=1&time=${new Date().toISOString()}`;

export default function SolarSystemViewerPage() {
  return (
    <div className="page-root planet-bg-root">
      <div
        className="planet-bg"
        style={{ backgroundImage: `url(${jupiterImg})` }}
      />
      <div className="planet-bg-fade" />

      <Navbar active="solar" />

      <main className="page-main">
        <div className="page-content">
          <header className="mb-4">
            <h1 className="font-headline fw-bold page-title mb-0">
              Solar <span className="text-gradient">System Viewer</span>
            </h1>
          </header>

          <div
            style={{
              width: "100%",
              height: "82vh",
              minHeight: "600px",
              borderRadius: "0.75rem",
              overflow: "hidden",
              border: "1px solid rgba(72, 71, 74, 0.25)",
              background: "#000",
              boxShadow: "0 8px 48px rgba(0, 0, 0, 0.6)",
            }}
          >
            <iframe
              src={NASA_EYES_URL}
              title="NASA Eyes on the Solar System"
              style={{ width: "100%", height: "100%", border: "none", display: "block" }}
              allow="fullscreen; accelerometer; gyroscope"
              allowFullScreen
              loading="lazy"
            />
          </div>

          <p
            className="page-subtitle mb-0 mt-3"
            style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}
          >
            Tip: drag to orbit, scroll to zoom, double-click a body to focus on it.
          </p>
        </div>
      </main>
    </div>
  );
}
