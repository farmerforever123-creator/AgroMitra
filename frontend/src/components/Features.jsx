import './landing.css'

const features = [
  {
    icon: '🌾',
    title: 'Direct Farmer to Buyer',
    description:
      'Connect farmers and buyers directly with a trusted and simplified selling flow.',
  },
  {
    icon: '💰',
    title: 'Real-time Pricing',
    description:
      'Fair and transparent pricing to help users make better buying decisions.',
  },
  {
    icon: '🛡️',
    title: 'Secure Experience',
    description:
      'Reliable authentication, cleaner access flow, and safer marketplace usage.',
  },
  {
    icon: '📦',
    title: 'Easy Product Listing',
    description:
      'Showcase and discover agricultural products through a modern catalog experience.',
  },
]

export default function Features() {
  return (
    <section className="section features-section premium-features-section">
      <div className="container">
        <div className="section-head reveal-up">
          <span className="section-badge">Features</span>
          <h2>Everything needed for a better agri marketplace</h2>
          <p>
            AgroMitra is designed to create a cleaner, faster, and more
            professional buying and selling experience for modern agriculture.
          </p>
        </div>

        <div className="feature-grid premium-feature-grid">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`feature-card premium-feature-card reveal-up reveal-delay-${(index % 4) + 1}`}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <span className="feature-link">Learn more →</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}