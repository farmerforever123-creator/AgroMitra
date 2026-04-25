import Hero from '../components/Hero'
import Features from '../components/Features'
import Reviews from '../components/Reviews'
import '../components/landing.css'
import { Link } from 'react-router-dom'

function FeatureRow() {
  return (
    <div className="mini-feature-row reveal-up">
      <div className="mini-feature-item">
        <span className="mini-feature-icon">🔒</span>
        Secure Transactions
      </div>
      <div className="mini-feature-item">
        <span className="mini-feature-icon">📈</span>
        Best Market Prices
      </div>
      <div className="mini-feature-item">
        <span className="mini-feature-icon">🎧</span>
        24/7 Expert Support
      </div>
    </div>
  )
}

function StatsSection() {
  const stats = [
    { value: '50K+', label: 'Happy Farmers' },
    { value: '10K+', label: 'Products Listed' },
    { value: '500+', label: 'Verified Buyers' },
    { value: '25%', label: 'Avg. Income Growth' },
  ]

  return (
    <section className="stats-strip-modern reveal-up">
      {stats.map((item) => (
        <div key={item.label} className="stat-modern">
          <h2>{item.value}</h2>
          <p>{item.label}</p>
        </div>
      ))}
    </section>
  )
}

function CTABanner() {
  return (
    <section className="cta-banner-wrapper reveal-up">
      <div className="cta-banner-inner">
        <h2>Take Your Farming Business to the Next Level</h2>
        <p>Join thousands of farmers already selling smarter with AgroMitra.</p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link to="/register" className="btn" style={{ background: 'white', color: '#15803d', fontWeight: 'bold' }}>
            Get Started Now
          </Link>
          <Link to="/products" className="btn" style={{ border: '1px solid white', color: 'white' }}>
            Explore Marketplace
          </Link>
        </div>
      </div>
    </section>
  )
}


export default function Home() {
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', overflowX: 'hidden' }}>
      <Hero />
      <FeatureRow />
      <Features />
      <StatsSection />
      <Reviews />
      <CTABanner />

    </div>
  )
}