"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { Analytics } from "@vercel/analytics/next"
import { Geist } from "next/font/google"
import "./globals.css"
import "./layout.css"

// Initialize font
const geist = Geist({ 
  subsets: ["latin"],
  variable: "--font-geist", // CSS variable for custom properties
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <html lang="en">
      <head>
        <title>events.dz | Algerian Health Science Events Platform</title>
        <meta
          name="description"
          content="Manage health science events, connect researchers worldwide, and digitalize your scientific conferences with events.dz"
        />
        <meta
          name="keywords"
          content="health events, medical conferences, scientific events, Algeria, research platform"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${geist.className} antialiased`}>
        {/* Navigation */}
        <nav className="nav-header">
          <div className="nav-container">
            <div className="nav-content">
              <Link href="/" className="logo">
                <span className="logo-main">events</span>
                <span className="logo-accent">.dz</span>
              </Link>

              {/* Desktop Menu */}
              <div className="nav-menu">
                <Link href="/" className="nav-link">
                  Home
                </Link>
                <Link href="/events" className="nav-link">
                  Events
                </Link>
                <Link href="/workshops" className="nav-link">
                  Workshops
                </Link>
                <Link href="/about" className="nav-link">
                  About Us
                </Link>
                <Link href="/contact" className="nav-link">
                  Contact Us
                </Link>
                <button className="nav-button">Sign Up</button>
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
              <Link href="/" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
              <Link href="/events" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                Events
              </Link>
              <Link href="/workshops" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                Workshops
              </Link>
              <Link href="/about" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                About Us
              </Link>
              <Link href="/contact" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                Contact Us
              </Link>
              <button className="nav-button mobile-button">Sign Up</button>
            </div>
          )}
        </nav>

        {/* Main Content with margin for fixed navbar */}
        <main className="main-content">{children}</main>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-grid">
              {/* About Column */}
              <div className="footer-column">
                <h3 className="footer-heading">About events.dz</h3>
                <p className="footer-text">
                  Leading platform for health science event management in Algeria. We connect researchers,
                  professionals, and institutions worldwide.
                </p>
              </div>

              {/* Quick Links */}
              <div className="footer-column">
                <h3 className="footer-heading">Quick Links</h3>
                <ul className="footer-links">
                  <li key="events">
                    <Link href="/events">Browse Events</Link>
                  </li>
                  <li key="workshops">
                    <Link href="/workshops">Workshops</Link>
                  </li>
                  <li key="submit">
                    <Link href="/submit">Submit Paper</Link>
                  </li>
                  <li key="register">
                    <Link href="/register">Register</Link>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div className="footer-column">
                <h3 className="footer-heading">Resources</h3>
                <ul className="footer-links">
                  <li key="guidelines">
                    <Link href="/guidelines">Submission Guidelines</Link>
                  </li>
                  <li key="faq">
                    <Link href="/faq">FAQs</Link>
                  </li>
                  <li key="support">
                    <Link href="/contact">Contact Support</Link>
                  </li>
                  <li key="privacy">
                    <Link href="/privacy">Privacy Policy</Link>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div className="footer-column">
                <h3 className="footer-heading">Contact Us</h3>
                <ul className="footer-contact">
                  <li>Email: info@events.dz</li>
                  <li>Phone: +213 564875214</li>
                  <li>Address: Constantine, Algeria</li>
                </ul>
              </div>
            </div>

            <div className="footer-bottom">
              <p className="footer-copyright">© 2025 events.dz. All rights reserved.</p>
            </div>
          </div>
        </footer>

        <Analytics />
      </body>
    </html>
  )
}