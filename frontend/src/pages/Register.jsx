import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { sendRegisterOtp, verifyRegisterOtp, verifyGst } from '../services/registerOtpService'
import { validateEmail, normalizeEmail } from '../utils/authUtils'
import { useLanguage } from '../context/LanguageContext'
import '../components/landing.css'

const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/

export default function Register() {
  const navigate = useNavigate()
  const { t } = useLanguage()

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

  // UI Feedback for email validation
  const isEmailValid = formData.email ? validateEmail(formData.email) : true;

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleInitialSubmit(e) {
    e.preventDefault()
    if (loading) return;

    // 1. Validation
    const normalizedEmail = normalizeEmail(formData.email);
    if (!validateEmail(normalizedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const dbRole = formData.role === 'seller' ? 'farmer' : formData.role;

      if (formData.role === 'seller') {
        if (!GST_REGEX.test(formData.gst_number)) {
          throw new Error('Invalid GST format. 15 characters required.')
        }
        const gstResult = await verifyGst({ gst_number: formData.gst_number })
        if (!gstResult.gst_verified) throw new Error(gstResult.message || 'GST verification failed.')
        
        setGstData({
          gst_number: formData.gst_number,
          gst_verified: gstResult.gst_verified,
          business_name: gstResult.business_name,
        })
      }

      // Check if we should use backend OTP flow
      const useBackendOtp = import.meta.env.VITE_USE_BACKEND_OTP === 'true';

      if (useBackendOtp) {
        console.log("USING BACKEND OTP FLOW");
        await sendRegisterOtp({ email: normalizedEmail });
        setSuccess('OTP sent to your email. Please verify to complete registration.');
        setStep('otp');
        return;
      }

      // 2. Fallback: Supabase Sign Up
      const payload = {
        email: normalizedEmail,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
            phone: formData.phone,
            role: dbRole
          }
        }
      };
      
      console.log("ATTEMPTING SUPABASE SIGNUP:", payload);

      const { data: authData, error: authError } = await supabase.auth.signUp(payload);

      if (authError) throw authError;

      const user = authData.user;
      if (!user) throw new Error("Registration failed. No user returned.");

      // 3. Profiles Table Sync (Only for direct Supabase signup)
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: formData.full_name,
          phone: formData.phone,
          role: dbRole,
          gst_number: formData.role === 'seller' ? formData.gst_number : null,
          business_name: formData.role === 'seller' ? (gstData?.business_name || '') : null,
          updated_at: new Date().toISOString()
        });

      if (profileError) console.error("Profile sync error:", profileError);

      setSuccess('Registration successful! Please check your email for a confirmation link.');
      
      setTimeout(() => {
        navigate(formData.role === 'buyer' ? '/buyer-login' : '/seller-login');
      }, 3500);

    } catch (err) {
      console.error("SIGNUP EXCEPTION:", err);
      let errMsg = err.message || 'Registration failed.';
      
      if (err.message?.includes('Failed to fetch')) {
        errMsg = "Connection failed. Please check if backend is running and Supabase URL is correct.";
      }

      setError(errMsg);
    } finally {
      setLoading(false)
    }
  }

  async function handleOtpSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const dbRole = formData.role === 'seller' ? 'farmer' : formData.role;
      const payload = {
        ...formData,
        role: dbRole,
        email: normalizeEmail(formData.email),
        otp,
        gst_verified: gstData?.gst_verified || false,
        business_name: gstData?.business_name || null
      };

      console.log("VERIFYING OTP WITH PAYLOAD:", payload);
      await verifyRegisterOtp(payload);

      setSuccess('Registration successful! Redirecting to login...');
      
      setTimeout(() => {
        navigate(formData.role === 'buyer' ? '/buyer-login' : '/seller-login');
      }, 2500);

    } catch (err) {
      console.error("OTP VERIFICATION ERROR:", err);
      setError(err.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  }

  // Reachability test on mount
  useEffect(() => {
    async function testSupabase() {
      console.log("TESTING SUPABASE REACHABILITY...");
      const { data, error } = await supabase.from("profiles").select("id").limit(1);
      if (error) {
        console.error("SUPABASE REACHABILITY TEST FAILED:", error);
      } else {
        console.log("SUPABASE IS REACHABLE. Test success.");
      }
    }
    testSupabase();
  }, []);

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
            <span className="register-badge">{t('auth.join')}</span>
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
                {step === 'register' ? t('auth.createAccount') : 'Email Verification'}
              </span>

              <h2>
                {step === 'register' ? t('auth.register') : 'Email OTP'}
              </h2>

              <p>
                {t('auth.registerSubtitle')}
              </p>
            </div>

            {error ? <div className="register-error">{typeof error === 'string' ? error : JSON.stringify(error)}</div> : null}
            {success ? <div className="register-success">{success}</div> : null}

            {step === 'register' ? (
              <form onSubmit={handleInitialSubmit} className="register-form">
                <div className="register-form-group">
                  <label>{t('auth.fullName')}</label>
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
                    <label>{t('auth.email')}</label>
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
                    <label>{t('auth.phone')}</label>
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
                    <label>{t('auth.password')}</label>
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
                    <label>{t('auth.role')}</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="buyer">Buyer</option>
                      <option value="seller">Seller/Farmer</option>
                    </select>
                  </div>
                </div>

                {formData.role === 'seller' && (
                  <div className="register-form-group">
                    <label>{t('auth.gst')}</label>
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
                  {loading ? (
                    <div className="btn-loader-wrapper">
                      <div className="spinner mini"></div>
                      <span>{t('auth.registering')}</span>
                    </div>
                  ) : (
                    t('auth.createAccount')
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="register-form">
                <div className="register-form-group">
                  <label>Enter 6-digit OTP</label>
                  <input
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="otp-input-field"
                    required
                  />
                  <small style={{ color: '#64748b', marginTop: '8px', display: 'block' }}>
                    A verification code has been sent to {formData.email}
                  </small>
                </div>

                <button type="submit" className="register-btn-main" disabled={loading}>
                  {loading ? (
                    <div className="btn-loader-wrapper">
                      <div className="spinner mini"></div>
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    'Verify OTP & Register'
                  )}
                </button>

                <button 
                  type="button" 
                  className="resend-otp-btn" 
                  onClick={handleInitialSubmit}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#10b981', 
                    cursor: 'pointer', 
                    marginTop: '15px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Resend OTP
                </button>
              </form>
            )}

            <div className="register-bottom">
              <p>
                {t('auth.haveAccount')}{' '}
                <Link to="/buyer-login">{t('auth.buyerLogin')}</Link> /{' '}
                <Link to="/seller-login">{t('auth.sellerLogin')}</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}