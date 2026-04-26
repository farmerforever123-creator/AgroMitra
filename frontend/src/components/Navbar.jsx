import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useLanguage } from '../context/LanguageContext'
import './landing.css'

export default function Navbar() {
  const navigate = useNavigate()
  const { t, language, changeLanguage } = useLanguage()

  const [user, setUser] = useState(null)
  const [role, setRole] = useState(localStorage.getItem('role'))
  const [cartCount, setCartCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const dropRef = useRef(null)

  useEffect(() => {
    loadUserAndCart()

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      loadUserAndCart()
      setRole(localStorage.getItem('role'))
    })

    function handleAuthChange() { 
      loadUserAndCart()
      setRole(localStorage.getItem('role'))
    }
    window.addEventListener('authChange', handleAuthChange)

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
      window.removeEventListener('authChange', handleAuthChange)
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
      .from('cart')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', currentUser.id)

    setCartCount(count || 0)
  }

  async function handleLogout() {
    setDropOpen(false)
    setMenuOpen(false)
    await supabase.auth.signOut()
    localStorage.clear() // Clear role and user data
    setUser(null)
    setCartCount(0)
    console.log("LOGOUT. Navigating to: /");
    window.dispatchEvent(new Event('authChange'))
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
          <Link to="/" onClick={() => console.log("NAVIGATING TO: /")}>{t('navbar.home')}</Link>

          {(role === 'seller' || role === 'farmer') ? (
            <Link to="/seller-dashboard" onClick={() => console.log("NAVIGATING TO: /seller-dashboard")}><strong>📊 {t('navbar.dashboard') || 'Dashboard'}</strong></Link>
          ) : (
            <Link to="/products" onClick={() => console.log("NAVIGATING TO: /products")}>{t('navbar.products')}</Link>
          )}

          <Link to="/contact" onClick={() => console.log("NAVIGATING TO: /contact")}>{t('navbar.contact')}</Link>

          {(role !== 'seller' && role !== 'farmer') && (
            <Link to="/cart" className="cart-link" onClick={() => console.log("NAVIGATING TO: /cart")}>
              🛒 {t('navbar.cart')}
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          )}
        </nav>

        <div className="premium-nav-right desktop-auth">
          <select 
            className="lang-switcher"
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
            style={{ marginRight: '15px', padding: '5px 10px', borderRadius: '5px', border: '1px solid #ccc', background: 'white' }}
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="gu">ગુજરાતી</option>
            <option value="pa">ਪੰਜਾਬੀ</option>
            <option value="bn">বাংলা</option>
          </select>

          {!user ? (
            <>
              <Link to="/buyer-login" className="premium-login-btn">{t('navbar.buyerLogin')}</Link>
              <Link to="/seller-login" className="premium-login-btn secondary">{t('navbar.sellerLogin')}</Link>
              <Link to="/register" className="premium-register-btn">{t('navbar.register')}</Link>
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
                  {(role === 'seller' || role === 'farmer') ? (
                    <Link to="/seller-dashboard" className="nav-drop-item" onClick={() => setDropOpen(false)}>
                      <span>📊</span> {t('navbar.dashboard') || 'Dashboard'}
                    </Link>
                  ) : (
                    <>
                      <Link to="/profile" className="nav-drop-item" onClick={() => setDropOpen(false)}>
                        <span>👤</span> {t('navbar.profile')}
                      </Link>
                      <Link to="/my-orders" className="nav-drop-item" onClick={() => setDropOpen(false)}>
                        <span>📦</span> {t('navbar.myOrders')}
                      </Link>
                    </>
                  )}
                  <Link to="/addresses" className="nav-drop-item" onClick={() => setDropOpen(false)}>
                    <span>📍</span> {t('navbar.addresses')}
                  </Link>
                  <Link to="/order-tracking" className="nav-drop-item" onClick={() => setDropOpen(false)}>
                    <span>🚚</span> {t('navbar.trackOrder')}
                  </Link>
                  <div className="nav-drop-divider" />
                  <button className="nav-drop-item nav-drop-logout" onClick={handleLogout}>
                    <span>🚪</span> {t('navbar.logout')}
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
          <Link onClick={() => setMenuOpen(false)} to="/">{t('navbar.home')}</Link>
          <Link onClick={() => setMenuOpen(false)} to="/products">{t('navbar.products')}</Link>
          <Link onClick={() => setMenuOpen(false)} to="/cart">
            {t('navbar.cart')} {cartCount > 0 ? `(${cartCount})` : ''}
          </Link>
          <Link onClick={() => setMenuOpen(false)} to="/contact">{t('navbar.contact')}</Link>

          <select 
            className="lang-switcher-mobile"
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
            style={{ margin: '10px 20px', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', background: 'white' }}
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="gu">ગુજરાતી</option>
            <option value="pa">ਪੰਜਾਬੀ</option>
            <option value="bn">বাংলা</option>
          </select>

          {!user ? (
            <>
              <Link onClick={() => setMenuOpen(false)} to="/buyer-login">{t('navbar.buyerLogin')}</Link>
              <Link onClick={() => setMenuOpen(false)} to="/seller-login">{t('navbar.sellerLogin')}</Link>
              <Link onClick={() => setMenuOpen(false)} to="/register">{t('navbar.register')}</Link>
            </>
          ) : (
            <>
              <Link onClick={() => setMenuOpen(false)} to="/profile">👤 {t('navbar.profile')}</Link>
              <Link onClick={() => setMenuOpen(false)} to="/my-orders">📦 {t('navbar.myOrders')}</Link>
              <Link onClick={() => setMenuOpen(false)} to="/addresses">📍 {t('navbar.addresses')}</Link>
              <Link onClick={() => setMenuOpen(false)} to="/order-tracking">🚚 {t('navbar.trackOrder')}</Link>
              <button onClick={handleLogout} className="mobile-logout-btn">🚪 {t('navbar.logout')}</button>
            </>
          )}
        </div>
      )}
    </header>
  )
}