import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import '../components/landing.css'

export default function BuyerLogin() {
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

      if (profile?.role !== 'buyer') {
        setError('This account is not registered as a buyer.')
        await supabase.auth.signOut()
        return
      }

      navigate('/products')
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="buyer-login-page">
      <div className="buyer-login-layout">
        <div className="buyer-login-visual">
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&q=80"
            alt="Buyer login"
            className="buyer-login-image"
          />
          <div className="buyer-login-overlay" />

          <div className="buyer-login-visual-content">
            <span className="buyer-login-badge">Buyer Portal</span>
            <h1>Shop smarter with AgroMitra</h1>
            <p>
              Access premium agricultural products, manage your cart, and buy
              seeds, fertilizers, tools, vegetables, and fruits from one modern
              marketplace.
            </p>

            <div className="buyer-login-highlights">
              <div className="highlight-card">
                <h3>Trusted Products</h3>
                <p>Buy with confidence from a cleaner and better marketplace.</p>
              </div>

              <div className="highlight-card">
                <h3>Fast Shopping</h3>
                <p>Explore products, compare options, and order quickly.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="buyer-login-form-side">
          <div className="buyer-login-card">
            <div className="buyer-login-top">
              <div className="buyer-login-icon">🛒</div>
              <span className="buyer-login-small-badge">Welcome Back</span>
              <h2>Buyer Login</h2>
              <p>Login to continue shopping and manage your AgroMitra cart.</p>
            </div>

            {error && <div className="buyer-login-error">{error}</div>}

            <form onSubmit={handleSubmit} className="buyer-login-form">
              <div className="buyer-form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="buyer@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <div className="buyer-form-group">
                <label>Password</label>
                <div className="password-field">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="buyer-login-row">
                <label className="remember-box">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>

                <Link to="/register" className="buyer-login-link">
                  Create account
                </Link>
              </div>

              <button type="submit" className="buyer-login-btn" disabled={loading}>
                {loading ? 'Logging in...' : 'Login as Buyer'}
              </button>
            </form>

            <div className="buyer-login-bottom">
              <p>
                Want to sell products instead?{' '}
                <Link to="/seller-login">Seller Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}