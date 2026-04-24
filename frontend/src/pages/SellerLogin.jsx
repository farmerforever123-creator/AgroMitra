<<<<<<< HEAD
import { Link, useNavigate } from 'react-router-dom'
=======
import { Link } from 'react-router-dom'
>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import '../components/landing.css'

export default function SellerLogin() {
<<<<<<< HEAD
  const navigate = useNavigate()

=======
>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82
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
<<<<<<< HEAD
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      const user = authData.user;
=======
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (loginError) {
        setError(loginError.message)
        setLoading(false)
        return
      }

      const userId = data.user.id
>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
<<<<<<< HEAD
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        throw new Error('Profile not found.');
      }

      if (profile.role !== 'seller' && profile.role !== 'farmer') {
        await supabase.auth.signOut();
        throw new Error('This account is not registered as a seller.');
      }

      // Log the login using the backend API
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
      await fetch(`${API_BASE_URL}/auth/login-log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, email: user.email, role: profile.role })
      }).catch(console.error);

      window.dispatchEvent(new Event('authChange'));
      navigate('/seller-dashboard');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
=======
        .eq('id', userId)
        .single()

      if (profileError) {
        setError(profileError.message)
        setLoading(false)
        return
      }

      if (profile.role !== 'farmer') {
        setError('This account is not registered as a seller.')
        await supabase.auth.signOut()
        setLoading(false)
        return
      }

      window.location.href = '/products'
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82
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

<<<<<<< HEAD
            {error && <div className="seller-login-error">{error}</div>}
=======
            {error ? <div className="seller-login-error">{error}</div> : null}
>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82

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
<<<<<<< HEAD

=======
>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82
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