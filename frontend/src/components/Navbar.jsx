import { Link } from 'react-router-dom'
import './landing.css'

export default function Navbar() {
  return (
    <header className="navbar premium-navbar">
      <div className="container navbar-inner premium-navbar-inner">
        <Link to="/" className="logo premium-logo">
          <div className="logo-icon premium-logo-icon">🌾</div>
          <div className="logo-text premium-logo-text">
            <strong>AgroMitra</strong>
            <span>Buyer &amp; Seller Marketplace</span>
          </div>
        </Link>

        <nav className="nav-links premium-nav-links">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <div className="nav-right premium-nav-right">
          <Link to="/buyer-login" className="login-btn premium-login-btn">
            Buyer Login
          </Link>

          <Link
            to="/seller-login"
            className="login-btn secondary premium-login-btn secondary"
          >
            Seller Login
          </Link>

          <Link to="/register" className="register-btn premium-register-btn">
            Register
          </Link>
        </div>
      </div>
    </header>
  )
}