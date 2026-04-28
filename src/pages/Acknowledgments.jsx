import { Link } from "react-router-dom";
import SiteFooter from "../components/SiteFooter";

export default function Acknowledgments() {
  return (
    <div className="bg-nebula legal-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="glow-orb-left" />
      <div className="glow-orb-right" />

      <header className="position-fixed top-0 w-100 d-flex justify-content-between align-items-center px-3 px-md-4 py-3 py-md-4" style={{ zIndex: 1 }}>
        <Link to="/" className="font-headline fw-bold fs-4 galileo-logo text-decoration-none">Galileo</Link>
      </header>

      <main className="container py-5 legal-main" style={{ maxWidth: "880px", marginTop: "5rem" }}>
        <span className="font-headline fw-bold section-eyebrow">Project Galileo</span>
        <h1 className="font-headline fw-bold hero-heading mb-3">
          <span className="text-gradient">Acknowledgments</span>
        </h1>
        <p className="legal-meta">With thanks to the people, projects, and pixels of light that made this possible.</p>

        <div className="glass-panel legal-panel p-4 p-md-5 position-relative">
          <p>
            Galileo would not exist without the work of countless astronomers, engineers, and open-source contributors. This page is a small thank-you to the projects and people whose tools, data, and guidance shaped the site.
          </p>

          <h2 className="font-headline legal-heading">The team</h2>
          <ul className="legal-list">
            <li>Michael Maxwell — Group lead</li>
            <li>Nathaniel Gosdin — Lead frontend developer</li>
            <li>Daniel Scheer — Lead backend developer</li>
          </ul>

          <h2 className="font-headline legal-heading">Course and instruction</h2>
          <p>
            Galileo was developed as the semester project for CSCI 470/570 (Software Development) at the University of South Carolina Beaufort, Spring 2026. We are grateful to the course staff for the structure, feedback, and review that pushed the project forward across each sprint.
          </p>

          <h2 className="font-headline legal-heading">Astronomical data, imagery, and APIs</h2>
          <p>
            Galileo would be a very empty calendar without the data services it queries. Many thanks to:
          </p>
          <ul className="legal-list">
            <li><strong>NASA</strong> for the open imagery, mission data, and the Eyes on the Solar System viewer that lets users see the planets in motion right inside Galileo.</li>
            <li><strong>U.S. National Weather Service (weather.gov)</strong> for free, high-quality weather forecast data.</li>
            <li><strong>Astronomy API (astronomyapi.com)</strong> for celestial event and body position data.</li>
            <li><strong>SIMBAD Astronomical Database</strong>, operated at CDS, Strasbourg, France, for the deep catalog of astronomical objects.</li>
            <li><strong>WikiSky</strong> for the embeddable sky map that gives the explore page its view of the heavens.</li>
            <li><strong>Google Maps Platform</strong> for the Elevation API.</li>
          </ul>
          <p>
            These services do the real heavy lifting; Galileo simply tries to present their data in a friendlier package.
          </p>

          <h2 className="font-headline legal-heading">Research and prior work</h2>
          <p>
            Galileo's approach to event visibility and observation planning was informed by prior work in astronomical scheduling. In particular, we drew inspiration from:
          </p>
          <ul className="legal-list">
            <li>
              Handley, L. B., Petigura, E. A., et al. <em>AstroQ: Automated Scheduling of Cadenced Astronomical Observations</em> (2025), arXiv:2506.08195. AstroQ's framing of observation scheduling as an optimization problem with cadence and accessibility constraints helped shape how we think about visibility ranking and planning in Galileo.
            </li>
          </ul>

          <h2 className="font-headline legal-heading">Open-source software</h2>
          <p>Galileo is built on the shoulders of many open-source projects, including:</p>
          <ul className="legal-list">
            <li><strong>React</strong> for the frontend interface.</li>
            <li><strong>Spring</strong> and <strong>Spring Boot</strong> for the backend service layer.</li>
            <li><strong>Apache Maven</strong> for dependency and build management.</li>
            <li><strong>PostgreSQL</strong> for the application database.</li>
            <li><strong>Git</strong> and <strong>GitHub</strong> for version control and collaboration.</li>
          </ul>
          <p>
            We are grateful to the maintainers and contributors of every library, plugin, and tool listed in our package files, even those not called out by name here.
          </p>

          <h2 className="font-headline legal-heading">Inspiration</h2>
          <p>
            The project is named after Galileo Galilei, whose careful observation of the night sky reshaped what humanity thought it knew about its place in the cosmos. We hope this small student project, in its own modest way, helps a few more people look up.
          </p>

          <h2 className="font-headline legal-heading">Thank you</h2>
          <p>
            Finally, thanks to our classmates, friends, and family who tested early builds, broke things in interesting ways, and gave honest feedback. Clear skies to all of you.
          </p>

          <div className="card-corner-glow" />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
