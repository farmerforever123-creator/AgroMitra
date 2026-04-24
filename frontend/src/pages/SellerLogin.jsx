import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import '../components/landing.css'

export default function SellerLogin() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (loginError) {
        setError(loginError.message)
        return
      }

      const userId = data.user?.id

      if (!userId) {
        setError('Login failed. User not found.')
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()

      if (profileError) {
        setError(profileError.message)
        await supabase.auth.signOut()
        return
      }

      if (profile?.role !== 'farmer') {
        setError('This account is not registered as a seller.')
        await supabase.auth.signOut()
        return
      }

      navigate('/seller-dashboard')
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="seller-login-page">
      <div className="seller-login-layout">
        <div className="seller-login-visual">
          <img
            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=80"
            alt="Seller login"
            className="seller-login-image"
          />
          <div className="seller-login-overlay" />

          <div className="seller-login-visual-content">
            <span className="seller-login-badge">Seller Access</span>
            <h1>Grow your business with AgroMitra</h1>
            <p>
              Login as a seller to manage products, reach buyers faster, and
              sell your agricultural inventory with confidence.
            </p>

            <div className="seller-login-highlights">
              <div className="seller-highlight-card">
                <h3>Manage Products</h3>
                <p>Add, organize, and showcase your inventory professionally.</p>
              </div>

              <div className="seller-highlight-card">
                <h3>Reach Buyers Faster</h3>
                <p>Expand your visibility and connect with real customers.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="seller-login-form-side">
          <div className="seller-login-card">
            <div className="seller-login-top">
              <div className="seller-login-icon">🌱</div>
              <span className="seller-login-small-badge">Welcome Back</span>
              <h2>Seller Login</h2>
              <p>Login to manage and sell your products on AgroMitra.</p>
            </div>

            {error && <div className="seller-login-error">{error}</div>}

            <form onSubmit={handleSubmit} className="seller-login-form">
              <div className="seller-form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="seller@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <div className="seller-form-group">
                <label>Password</label>
                <div className="seller-password-field">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />

                  <button
                    type="button"
                    className="seller-password-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="seller-login-row">
                <label className="seller-remember-box">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>

                <Link to="/register" className="seller-login-link">
                  Create account
                </Link>
              </div>

              <button type="submit" className="seller-login-btn" disabled={loading}>
                {loading ? 'Logging in...' : 'Login as Seller'}
              </button>
            </form>

            <div className="seller-login-bottom">
              <p>
                Want to buy products instead?{' '}
                <Link to="/buyer-login">Buyer Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}