import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import './landing.css'

export default function Navbar() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [cartCount, setCartCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const dropRef = useRef(null)

  useEffect(() => {
    loadUserAndCart()

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadUserAndCart()
    })

    function handleCartUpdated() { loadUserAndCart() }
    window.addEventListener('cartUpdated', handleCartUpdated)

    // Close dropdown on outside click
    function handleClickOutside(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      listener.subscription.unsubscribe()
      window.removeEventListener('cartUpdated', handleCartUpdated)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  async function loadUserAndCart() {
    const { data: userData } = await supabase.auth.getUser()
    const currentUser = userData?.user
    setUser(currentUser)

    if (!currentUser) { setCartCount(0); return }

    const { count } = await supabase
      .from('cart_items')
      .select('*', { count: 'exact', head: true })
      .eq('buyer_id', currentUser.id)

    setCartCount(count || 0)
  }

  async function handleLogout() {
    setDropOpen(false)
    setMenuOpen(false)
    await supabase.auth.signOut()
    setUser(null)
    setCartCount(0)
    navigate('/')
  }

  const displayName = user?.email?.split('@')[0] || 'Account'
  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <header className="premium-navbar">
      <div className="premium-navbar-inner full-width-navbar">
        <Link to="/" className="premium-logo">
          <div className="premium-logo-icon">🌾</div>
          <div className="premium-logo-text">
            <strong>AgroMitra</strong>

          </div>
        </Link>

        <nav className="premium-nav-links desktop-nav">
          <Link to="/">Home</Link>

          <Link to="/products">Products</Link>

          <Link to="/contact">Contact</Link>

          <Link to="/cart" className="cart-link">
            🛒 Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </nav>

        <div className="premium-nav-right desktop-auth">
          {!user ? (
            <>
              <Link to="/buyer-login" className="premium-login-btn">Buyer Login</Link>
              <Link to="/seller-login" className="premium-login-btn secondary">Seller Login</Link>
              <Link to="/register" className="premium-register-btn">Register</Link>
            </>
          ) : (
            <div className="nav-profile-wrapper" ref={dropRef}>
              <button
                className="nav-profile-btn"
                onClick={() => setDropOpen((p) => !p)}
                aria-expanded={dropOpen}
                aria-label="Account menu"
              >
                <span className="nav-avatar">{initials}</span>
                <span className="nav-display-name">{displayName}</span>
                <span className="nav-chevron">{dropOpen ? '▲' : '▼'}</span>
              </button>

              {dropOpen && (
                <div className="nav-dropdown-profile">
                  <Link to="/profile" className="nav-drop-item" onClick={() => setDropOpen(false)}>
                    <span>👤</span> Profile
                  </Link>
                  <Link to="/my-orders" className="nav-drop-item" onClick={() => setDropOpen(false)}>
                    <span>📦</span> My Orders
                  </Link>
                  <Link to="/addresses" className="nav-drop-item" onClick={() => setDropOpen(false)}>
                    <span>📍</span> Addresses
                  </Link>
                  <div className="nav-drop-divider" />
                  <button className="nav-drop-item nav-drop-logout" onClick={handleLogout}>
                    <span>🚪</span> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-nav-menu">
          <Link onClick={() => setMenuOpen(false)} to="/">Home</Link>
          <Link onClick={() => setMenuOpen(false)} to="/products">Products</Link>
          <Link onClick={() => setMenuOpen(false)} to="/cart">
            Cart {cartCount > 0 ? `(${cartCount})` : ''}
          </Link>
          <Link onClick={() => setMenuOpen(false)} to="/contact">Contact</Link>

          {!user ? (
            <>
              <Link onClick={() => setMenuOpen(false)} to="/buyer-login">Buyer Login</Link>
              <Link onClick={() => setMenuOpen(false)} to="/seller-login">Seller Login</Link>
              <Link onClick={() => setMenuOpen(false)} to="/register">Register</Link>
            </>
          ) : (
            <>
              <Link onClick={() => setMenuOpen(false)} to="/profile">👤 Profile</Link>
              <Link onClick={() => setMenuOpen(false)} to="/my-orders">📦 My Orders</Link>
              <Link onClick={() => setMenuOpen(false)} to="/addresses">📍 Addresses</Link>
              <button onClick={handleLogout} className="mobile-logout-btn">🚪 Logout</button>
            </>
          )}
        </div>
      )}
    </header>
  )
}