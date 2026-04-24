import { Link } from 'react-router-dom'
import './landing.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="reveal-up">
          <h3>AgroMitra</h3>
          <p>
            A modern agriculture marketplace connecting farmers and buyers
            directly with a cleaner and smarter digital experience.
          </p>
        </div>

        <div className="reveal-up reveal-delay-2">
          <h4>Quick Links</h4>
          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/register">Register</Link>
          </div>
        </div>

        <div className="reveal-up reveal-delay-3">
          <h4>Contact</h4>
          <p>support@agromitra.com</p>
          <p>+91 98765 43210</p>
          <p>Lucknow, India</p>
        </div>
      </div>

      <div className="footer-bottom">
        © 2026 AgroMitra. All rights reserved.
      </div>
    </footer>
  )
}