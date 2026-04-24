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

function CategoryShowcase() {
  const categories = [
    { icon: '🌱', title: 'Seeds', text: 'Quality seeds for better yield' },
    { icon: '🧪', title: 'Fertilizers', text: 'Boost crop growth smartly' },
    { icon: '🛠️', title: 'Farm Tools', text: 'Modern tools for farmers' },
    { icon: '🥦', title: 'Vegetables', text: 'Fresh farm vegetables' },
    { icon: '🍎', title: 'Fruits', text: 'Direct fresh fruits' },
  ]

  return (
    <section className="home-category-section">
      <div className="container">
        <div className="home-section-title">
          <span>Shop by Category</span>
          <h2>Everything farmers and buyers need</h2>
        </div>

        <div className="home-category-grid">
          {categories.map((item) => (
            <a href="/products" className="home-category-card" key={item.title}>
              <div>{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturedProductsPreview() {
  const products = [
    { name: 'Premium Seeds', price: '₹144', img: '🌾' },
    { name: 'Organic Fertilizer', price: '₹249', img: '🧪' },
    { name: 'Fresh Vegetables', price: '₹178', img: '🥦' },
    { name: 'Farm Tools', price: '₹399', img: '🛠️' },
  ]

  return (
    <section className="home-product-preview">
      <div className="container">
        <div className="home-section-title">
          <span>Trending Products</span>
          <h2>Popular picks for smart agriculture</h2>
        </div>

        <div className="home-preview-grid">
          {products.map((item) => (
            <div className="home-preview-card" key={item.name}>
              <div className="home-preview-img">{item.img}</div>
              <h3>{item.name}</h3>
              <p>{item.price}</p>
              <a href="/products">Explore</a>
            </div>
          ))}
        </div>
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
      <CategoryShowcase />
      <FeaturedProductsPreview />
      <About />
      <Features />
      <Reviews />
      <CTASection />
    </>
  )
}