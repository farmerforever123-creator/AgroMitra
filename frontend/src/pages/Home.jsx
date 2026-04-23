import Hero from '../components/Hero'
import About from '../components/About'
import Features from '../components/Features'
import Reviews from '../components/Reviews'
import '../components/landing.css'

function StatsSection() {
  const stats = [
    { value: '10K+', label: 'Active Buyers' },
    { value: '2K+', label: 'Farm Sellers' },
    { value: '50K+', label: 'Products Listed' },
    { value: '99%', label: 'Customer Satisfaction' },
  ]

  return (
    <section className="stats-strip">
      <div className="container stats-grid">
        {stats.map((item) => (
          <div key={item.label} className="stat-card reveal-up">
            <h3>{item.value}</h3>
            <p>{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="home-cta">
      <div className="container cta-box reveal-up">
        <div>
          <span className="section-badge">Get Started</span>
          <h2>Start buying and selling with confidence today</h2>
          <p>
            Join AgroMitra and experience a smarter way to connect farmers and
            buyers in one modern digital marketplace.
          </p>
        </div>

        <div className="cta-actions">
          <a href="/register" className="btn btn-primary">
            Create Account
          </a>
          <a href="/products" className="btn btn-secondary dark-secondary">
            Explore Products
          </a>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <StatsSection />
      <About />
      <Features />
      <Reviews />
      <CTASection />
    </>
  )
}