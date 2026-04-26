import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { validateEmail, normalizeEmail } from '../utils/authUtils'
import { useLanguage } from '../context/LanguageContext'
import '../components/landing.css'

export default function BuyerLogin() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Check for email validity for UI feedback
  const isEmailValid = email ? validateEmail(email) : true;

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return; // Prevent duplicate requests

    const normalizedEmail = normalizeEmail(email);
    if (!validateEmail(normalizedEmail)) {
      setError('Please enter a valid and secure email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 2. Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      // Proper error message for invalid credentials
      if (authError) {
        if (authError.message.includes("Invalid login credentials")) {
          throw new Error("Invalid email or password");
        }
        throw authError;
      }

      // 3. Login ke baad authenticated user safely fetch karo
      const { data: { user }, error: userFetchError } = await supabase.auth.getUser();
      if (userFetchError || !user) throw new Error("Authentication failed. Please try again.");

      // Check role and handle null user safely
      let userRole = 'buyer'; // Default for this page

      // Profiles table sync (upsert)
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          role: userRole,
          email: user.email,
          updated_at: new Date().toISOString()
        });
      
      if (upsertError) console.error("Profile sync error:", upsertError.message);

      // Store role, user, and token in localStorage
      localStorage.setItem('role', userRole);
      localStorage.setItem('user', JSON.stringify(user));
      if (authData.session) {
        localStorage.setItem('token', authData.session.access_token);
      }

      console.log("LOGIN SUCCESS. Navigating to: /");
      window.dispatchEvent(new Event('authChange'));
      navigate('/'); // Redirect to Buyer Home
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
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
              <span className="buyer-login-small-badge">{t('auth.welcome')}</span>
              <h2>{t('auth.buyerLogin')}</h2>
              <p>Login to continue shopping and manage your AgroMitra cart.</p>
            </div>

            {error && <div className="buyer-login-error">{error}</div>}

            <form onSubmit={handleSubmit} className="buyer-login-form">
              <div className="buyer-form-group">
                <label>{t('auth.email')}</label>
                <input
                  type="email"
                  placeholder="buyer@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <div className="buyer-form-group">
                <label>{t('auth.password')}</label>
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
                  {t('auth.createAccount')}
                </Link>
              </div>

              <button type="submit" className="buyer-login-btn" disabled={loading}>
                {loading ? (
                  <div className="btn-loader-wrapper">
                    <div className="spinner mini"></div>
                    <span>{t('auth.loggingIn') || 'Logging in...'}</span>
                  </div>
                ) : (
                  t('auth.login')
                )}
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