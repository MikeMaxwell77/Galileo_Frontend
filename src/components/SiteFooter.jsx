import { Link } from "react-router-dom";

export default function SiteFooter() {
  return (
    <footer className="site-footer py-4 w-100 d-flex flex-column align-items-center gap-3">
      <div className="d-flex gap-4 flex-wrap justify-content-center">
        <Link to="/privacy" className="footer-link">Privacy Protocol</Link>
        <Link to="/terms" className="footer-link">Terms of Orbit</Link>
        <Link to="/acknowledgments" className="footer-link">Acknowledgments</Link>
      </div>
      <div className="footer-copyright">© 2026 Galileo Interstellar Systems • v4.0.2-Stable</div>
    </footer>
  );
}
