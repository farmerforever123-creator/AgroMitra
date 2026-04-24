import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { sendRegisterOtp, verifyRegisterOtp } from '../services/registerOtpService'
import '../components/landing.css'

export default function Register() {
  const navigate = useNavigate()

  const [step, setStep] = useState('register')
  const [otp, setOtp] = useState('')
  const [devOtp, setDevOtp] = useState('')

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

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSendOtp(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await sendRegisterOtp(formData)
      setDevOtp(result.devOtp || '')
      setSuccess('OTP sent successfully. Please verify your email.')
      setStep('otp')
    } catch (err) {
      setError(err.message || 'OTP send failed.')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await verifyRegisterOtp(formData.email, otp)
      const userData = result.user || formData

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.full_name,
            phone: userData.phone,
            role: userData.role,
          },
        },
      })

      if (signUpError) throw signUpError

      const userId = data.user?.id

      if (userId) {
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: userId,
          full_name: userData.full_name,
          email: userData.email,
          phone: userData.phone,
          role: userData.role,
          is_verified: true,
        })

        if (profileError) throw profileError
      }

      setSuccess('Registration successful. Redirecting...')

      setTimeout(() => {
        navigate(userData.role === 'buyer' ? '/buyer-login' : '/seller-login')
      }, 1200)
    } catch (err) {
      setError(err.message || 'OTP verification failed.')
    } finally {
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

          <div className="register-overlay"></div>

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

              <span className="register-small-badge">
                {step === 'register' ? 'Create Account' : 'Verify Email'}
              </span>

              <h2>{step === 'register' ? 'Register' : 'OTP Verification'}</h2>

              <p>
                {step === 'register'
                  ? 'Create your AgroMitra account and continue your journey.'
                  : `Enter the 6 digit OTP sent to ${formData.email}`}
              </p>
            </div>

            {error && <div className="register-error">{error}</div>}
            {success && <div className="register-success">{success}</div>}

            {step === 'register' ? (
              <form onSubmit={handleSendOtp} className="register-form">
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
                        onClick={() => setShowPassword(!showPassword)}
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

                <button className="register-btn-main" disabled={loading}>
                  {loading ? 'Sending OTP...' : 'Create Account'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="register-form">
                {devOtp && (
                  <div className="otp-test-box">
                    Testing OTP: <b>{devOtp}</b>
                  </div>
                )}

                <div className="register-form-group">
                  <label>Enter OTP</label>
                  <input
                    className="register-otp-input"
                    type="text"
                    placeholder="Enter 6 digit OTP"
                    value={otp}
                    maxLength="6"
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                </div>

                <button className="register-btn-main" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>

                <button
                  type="button"
                  className="register-btn-secondary"
                  onClick={() => {
                    setStep('register')
                    setOtp('')
                    setError('')
                    setSuccess('')
                  }}
                >
                  Back to Register
                </button>
              </form>
            )}

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