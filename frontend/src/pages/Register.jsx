import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  sendRegisterOtp,
  verifyRegisterOtp,
  verifyGst,
} from '../services/registerOtpService'
import '../components/landing.css'

const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/

export default function Register() {
  const navigate = useNavigate()

  // step can be: 'register', 'otp'
  const [step, setStep] = useState('register')
  const [otp, setOtp] = useState('')
  const [gstData, setGstData] = useState(null)

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    role: 'buyer',
    gst_number: '',
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

  async function handleInitialSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (formData.role === 'farmer') {
        // Validate GST format on frontend
        if (!GST_REGEX.test(formData.gst_number)) {
          throw new Error('Invalid GST number format. Must be 15 characters in valid GSTIN format (e.g., 22AAAAA0000A1Z5).')
        }

        // Call backend GST verification
        const gstResult = await verifyGst({ gst_number: formData.gst_number })

        if (!gstResult.gst_verified) {
          throw new Error(gstResult.message || 'GST verification failed.')
        }

        // Save GST verification data for later use during OTP verify
        setGstData({
          gst_number: formData.gst_number,
          gst_verified: gstResult.gst_verified,
          business_name: gstResult.business_name,
        })

        setSuccess(`GST verified! Business: ${gstResult.business_name}. Sending email OTP...`)
      }

      // Send email OTP (same for buyer and farmer)
      await sendRegisterOtp(formData)
      setSuccess((prev) =>
        formData.role === 'farmer'
          ? `GST verified! Email OTP sent to ${formData.email}. Please verify.`
          : `Email OTP sent successfully to ${formData.email}. Please verify.`
      )
      setStep('otp')
      setOtp('')
    } catch (err) {
      setError(err.message || 'Action failed.')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyRegisterOtp(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const payload = { ...formData, otp }

      // Attach GST data for farmer/seller
      if (formData.role === 'farmer' && gstData) {
        payload.gst_number = gstData.gst_number
        payload.gst_verified = gstData.gst_verified
        payload.business_name = gstData.business_name
      }

      await verifyRegisterOtp(payload)

      setSuccess('Registration successful. Redirecting...')

      setTimeout(() => {
        navigate(formData.role === 'buyer' ? '/buyer-login' : '/seller-login')
      }, 1500)
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

              <span className="register-small-badge">
                {step === 'register' ? 'Create Account' : 'Email Verification'}
              </span>

              <h2>
                {step === 'register' ? 'Register' : 'Email OTP'}
              </h2>

              <p>
                {step === 'register'
                  ? 'Create your AgroMitra account and continue your journey.'
                  : `Enter the 6 digit OTP sent to ${formData.email}`}
              </p>
            </div>

            {error ? <div className="register-error">{error}</div> : null}
            {success ? <div className="register-success">{success}</div> : null}

            {step === 'register' ? (
              <form onSubmit={handleInitialSubmit} className="register-form">
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
                      required
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
                      <option value="farmer">Seller/Farmer</option>
                    </select>
                  </div>
                </div>

                {formData.role === 'farmer' && (
                  <div className="register-form-group">
                    <label>GST Number (GSTIN)</label>
                    <input
                      type="text"
                      name="gst_number"
                      placeholder="e.g. 22AAAAA0000A1Z5"
                      value={formData.gst_number}
                      maxLength="15"
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, '')
                        handleChange({ target: { name: 'gst_number', value: val } })
                      }}
                      required
                    />
                    <small style={{ color: '#64748b', marginTop: '4px', display: 'block' }}>
                      15 character GSTIN format required for seller verification
                    </small>
                  </div>
                )}

                <button type="submit" className="register-btn-main" disabled={loading}>
                  {loading ? 'Processing...' : 'Create Account'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyRegisterOtp} className="register-form">
                <div className="register-form-group">
                  <label>Enter Email OTP</label>
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
                  {loading ? 'Verifying...' : 'Verify Email OTP'}
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