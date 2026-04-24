import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import './landing.css'

export default function Navbar() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [cartCount, setCartCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    loadUserAndCart()

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadUserAndCart()
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  async function loadUserAndCart() {
    const { data } = await supabase.auth.getUser()
    setUser(data.user)

    if (!data.user) {
      setCartCount(0)
      return
    }

    const { count } = await supabase
      .from('cart_items')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', data.user.id)

    setCartCount(count || 0)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
    setCartCount(0)
    navigate('/')
  }

  return (
    <header className="premium-navbar">
      <div className="premium-navbar-inner full-width-navbar">
        <Link to="/" className="premium-logo">
          <div className="premium-logo-icon">🌾</div>

          <div className="premium-logo-text">
            <strong>AgroMitra</strong>
            <span>Buyer & Seller Marketplace</span>
          </div>
        </Link>

        <nav className="premium-nav-links desktop-nav">
          <Link to="/">Home</Link>

          <div className="nav-dropdown">
            <Link to="/products">Products</Link>

            <div className="nav-dropdown-menu">
              <Link to="/products?category=seeds">Seeds</Link>
              <Link to="/products?category=fertilizers">Fertilizers</Link>
              <Link to="/products?category=tools">Tools</Link>
              <Link to="/products?category=vegetables">Vegetables</Link>
              <Link to="/products?category=fruits">Fruits</Link>
            </div>
          </div>

          <Link to="/contact">Contact</Link>

          <Link to="/cart" className="cart-link">
            🛒 Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </nav>

        <div className="premium-nav-right desktop-auth">
          {!user ? (
            <>
              <Link to="/buyer-login" className="premium-login-btn">
                Buyer Login
              </Link>

              <Link to="/seller-login" className="premium-login-btn secondary">
                Seller Login
              </Link>

              <Link to="/register" className="premium-register-btn">
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="nav-user">
                {user.email?.split('@')[0]}
              </span>

              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
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
              <Link onClick={() => setMenuOpen(false)} to="/buyer-login">
                Buyer Login
              </Link>
              <Link onClick={() => setMenuOpen(false)} to="/seller-login">
                Seller Login
              </Link>
              <Link onClick={() => setMenuOpen(false)} to="/register">
                Register
              </Link>
            </>
          ) : (
            <button onClick={handleLogout}>Logout</button>
          )}
        </div>
      )}
    </header>
  )
}