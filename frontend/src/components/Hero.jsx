import './landing.css'

export default function Hero() {
  return (
    <section className="hero-split">
      <div className="hero-split-left reveal-up">
        <h1>
          India's Trusted <br />
          <span className="highlight-green">Agriculture</span> Marketplace
        </h1>
        <p>
          Connect directly with verified buyers and sellers. Get the best market
          prices, secure transactions, and a smarter way to grow your farming business.
        </p>

        <div className="hero-split-buttons">
          <a href="/register" className="btn btn-primary">
            Get Started
          </a>
          <a href="/products" className="btn btn-secondary dark-secondary" style={{ color: '#0f172a', background: 'transparent', border: '1px solid #cbd5e1' }}>
            Explore Marketplace
          </a>
        </div>
      </div>

      <div className="hero-split-right reveal-up reveal-delay-2">
        <img
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80"
          alt="Farmer in field"
          className="hero-main-img"
        />
        
        <div className="hero-floating-stat">
          <div className="icon">📈</div>
          <div>
            <strong>Smart Dashboard</strong>
            <span>Manage inventory easily</span>
          </div>
        </div>

        <div className="hero-floating-stat second">
          <div className="icon">📱</div>
          <div>
            <strong>Direct Buyers</strong>
            <span>Connect instantly</span>
          </div>
        </div>
      </div>
    </section>
  )
}