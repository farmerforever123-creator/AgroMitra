import { useEffect, useState } from 'react'
import './landing.css'

const slides = [
  {
    image:
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1800&q=80',
    title: 'Fresh From Farm To Market',
    description:
      'A premium agriculture marketplace connecting farmers and buyers directly with trust, transparency, and better pricing.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1800&q=80',
    title: 'Empowering Farmers With Technology',
    description:
      'Sell smarter, manage inventory faster, and reach more buyers through a clean digital commerce experience.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1800&q=80',
    title: 'Trusted Products, Better Growth',
    description:
      'Discover seeds, fertilizers, tools, vegetables, and fruits with a reliable and modern shopping flow.',
  },
]

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="hero hero-premium">
      {slides.map((slide, index) => (
        <div
          key={slide.title}
          className={`hero-slide ${index === activeIndex ? 'active' : ''}`}
        >
          <img src={slide.image} alt={slide.title} />
          <div className="hero-overlay premium-overlay" />
        </div>
      ))}

      <div className="hero-content full-width premium-hero-content">
        <span className="hero-badge">Smart Agriculture Marketplace</span>

        <h1 key={slides[activeIndex].title} className="hero-title-slide">
          {slides[activeIndex].title}
        </h1>

        <p key={slides[activeIndex].description} className="hero-text-slide">
          {slides[activeIndex].description}
        </p>

        <div className="hero-buttons">
          <a href="/products" className="btn btn-primary">
            Explore Products
          </a>
          <a href="/register" className="btn btn-secondary">
            Join AgroMitra
          </a>
        </div>

        <div className="hero-floating-cards">
          <div className="floating-card reveal-up">
            <strong>Direct Trade</strong>
            <span>No middlemen, better value</span>
          </div>
          <div className="floating-card reveal-up reveal-delay-2">
            <strong>Fast Access</strong>
            <span>Products, buyers, and sellers in one place</span>
          </div>
        </div>

        <div className="hero-dots">
          {slides.map((slide, index) => (
            <button
              key={slide.title}
              className={`dot ${activeIndex === index ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to ${slide.title}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}