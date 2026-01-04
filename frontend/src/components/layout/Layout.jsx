import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./layout.css";

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token); // true if token exists, false otherwise
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false); // Update login state
    navigate("/login");
  };

  return (
    <div className="layout-wrapper">
      {/* Navigation */}
      <nav className="nav-header">
        <div className="nav-container">
          <div className="nav-content">
            <Link to="/" className="logo">
              <span className="logo-main">SciCon</span>
              <span className="logo-accent">.</span>
            </Link>

            {/* Desktop Menu */}
            <div className="nav-menu">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/events" className="nav-link">Events</Link>
              <Link to="/workshops" className="nav-link">Workshops</Link>
              <Link to="/about" className="nav-link">About Us</Link>
              <Link to="/contact" className="nav-link">Contact Us</Link>

              {/* Show Avatar ONLY when logged in */}
              {isLoggedIn ? (
                <div className="user-dropdown">
                  <button className="avatar-button">
                    <span className="avatar">👤</span>
                  </button>

                  <div className="dropdown-menu">
                    <Link to="/profile" className="dropdown-item">Profile</Link>
                    <Link to="/settings" className="dropdown-item">Settings</Link>
                    <button onClick={handleLogout} className="dropdown-item">Logout</button>
                  </div>
                </div>
              ) : (
                <div className="user-dropdown">
                  <button className="avatar-button">
                    <span className="avatar">👤</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="mobile-menu">
            <Link to="/" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link to="/events" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
              Events
            </Link>
            <Link to="/workshops" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
              Workshops
            </Link>
            <Link to="/about" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
              About Us
            </Link>
            <Link to="/contact" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
              Contact Us
            </Link>

            {/* Mobile: Show Login/Register or Avatar options */}
            {isLoggedIn ? (
              <>
                <Link to="/profile" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
                <Link to="/settings" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                  Settings
                </Link>
                <button className="nav-button mobile-button" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              null
            )}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="main-content">{children}</main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            {/* About Column */}
            <div className="footer-column">
              <h3 className="footer-heading">About SciCon</h3>
              <p className="footer-text">
                Leading platform for health science event management in Algeria. We connect researchers,
                professionals, and institutions worldwide.
              </p>
            </div>

            {/* Quick Links */}
            <div className="footer-column">
              <h3 className="footer-heading">Quick Links</h3>
              <ul className="footer-links">
                <li>
                  <Link to="/events">Browse Events</Link>
                </li>
                <li>
                  <Link to="/workshops">Workshops</Link>
                </li>
                <li>
                  <Link to="/submit">Submit Paper</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="footer-column">
              <h3 className="footer-heading">Resources</h3>
              <ul className="footer-links">
                <li>
                  <Link to="/guidelines">Submission Guidelines</Link>
                </li>
                <li>
                  <Link to="/faq">FAQs</Link>
                </li>
                <li>
                  <Link to="/contact">Contact Support</Link>
                </li>
                <li>
                  <Link to="/privacy">Privacy Policy</Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="footer-column">
              <h3 className="footer-heading">Contact Us</h3>
              <ul className="footer-contact">
                <li>Email: info@SciCon</li>
                <li>Phone: +213 564875214</li>
                <li>Address: Constantine, Algeria</li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">© 2025 SciCon. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}