import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { validateEmail, normalizeEmail } from '../utils/authUtils'
import { useLanguage } from '../context/LanguageContext'
import '../components/landing.css'

export default function SellerLogin() {
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
    if (loading) return; // 10. Prevent duplicate requests

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

      // 8. Proper error message for invalid credentials
      if (authError) {
        if (authError.message.includes("Invalid login credentials")) {
          throw new Error("Invalid email or password");
        }
        throw authError;
      }

      // 3. Login ke baad authenticated user safely fetch karo
      const { data: { user }, error: userFetchError } = await supabase.auth.getUser();
      if (userFetchError || !user) throw new Error("Authentication failed. Please try again.");

      // 4. Check role and handle null user safely
      let userRole = 'farmer'; // Matches DB constraint (was 'seller')

      // 6. Profiles table sync (upsert)
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          role: userRole,
          email: user.email,
          updated_at: new Date().toISOString()
        });
      
      if (upsertError) console.error("Profile sync error:", upsertError.message);

      // 5. Store role, user, and token in localStorage - Keep 'seller' for UI consistency if needed, 
      // but 'farmer' is also fine as long as Navbar handles it.
      localStorage.setItem('role', 'seller'); 
      localStorage.setItem('user', JSON.stringify(user));
      if (authData.session) {
        localStorage.setItem('token', authData.session.access_token);
      }

      // 7. Successful login ke baad redirect
      console.log("LOGIN SUCCESS. Navigating to: /seller-dashboard");
      window.dispatchEvent(new Event('authChange'));
      navigate('/seller-dashboard');

    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
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
                <label>{t('auth.email')}</label>
                <input
                  type="email"
                  placeholder="seller@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <div className="seller-form-group">
                <label>{t('auth.password')}</label>
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
                  {t('auth.createAccount')}
                </Link>
              </div>

              <button type="submit" className="seller-login-btn" disabled={loading}>
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