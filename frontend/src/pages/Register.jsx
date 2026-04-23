import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import '../components/landing.css'

export default function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    role: 'buyer',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
            phone: formData.phone,
            role: formData.role,
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }

      const userId = data.user?.id

      if (userId) {
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: userId,
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
        })

        if (profileError) {
          setError(profileError.message)
          setLoading(false)
          return
        }
      }

      setSuccess('Registration successful. Redirecting...')
      setLoading(false)

      setTimeout(() => {
        navigate(formData.role === 'buyer' ? '/buyer-login' : '/seller-login')
      }, 1200)
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <section className="register-page">
      <div className="register-layout">
        <div className="register-visual">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80"
            alt="Register"
            className="register-image"
          />
          <div className="register-overlay" />

          <div className="register-visual-content">
            <span className="register-badge">Join AgroMitra</span>
            <h1>Start buying and selling with confidence</h1>
            <p>
              Create your AgroMitra account to explore products as a buyer or
              manage and sell agricultural inventory as a seller.
            </p>

            <div className="register-highlights">
              <div className="register-highlight-card">
                <h3>Buyer Access</h3>
                <p>Explore products, manage your cart, and shop smarter.</p>
              </div>

              <div className="register-highlight-card">
                <h3>Seller Access</h3>
                <p>List products, reach buyers faster, and grow online.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="register-form-side">
          <div className="register-card">
            <div className="register-top">
              <div className="register-icon">✨</div>
              <span className="register-small-badge">Create Account</span>
              <h2>Register</h2>
              <p>Create your AgroMitra account and continue your journey.</p>
            </div>

            {error ? <div className="register-error">{error}</div> : null}
            {success ? <div className="register-success">{success}</div> : null}

            <form onSubmit={handleSubmit} className="register-form">
              <div className="register-form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  placeholder="Enter your full name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="register-grid-two">
                <div className="register-form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="register-form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="register-grid-two">
                <div className="register-form-group">
                  <label>Password</label>
                  <div className="register-password-field">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="register-password-toggle"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <div className="register-form-group">
                  <label>Register As</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="buyer">Buyer</option>
                    <option value="farmer">Seller</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="register-btn-main" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className="register-bottom">
              <p>
                Already have an account?{' '}
                <Link to="/buyer-login">Buyer Login</Link> /{' '}
                <Link to="/seller-login">Seller Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}