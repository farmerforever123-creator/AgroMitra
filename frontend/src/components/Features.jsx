import './landing.css'

const features = [
  {
    icon: '🛒',
    title: 'Buy Quality Produce',
    description:
      'Access a wide range of fresh, verified agricultural products directly from trusted farmers at the best market rates.',
  },
  {
    icon: '🤝',
    title: 'Sell with Confidence',
    description:
      'List your farm inventory easily, reach thousands of buyers instantly, and secure faster payments without middlemen.',
  },
  {
    icon: '📊',
    title: 'Smart Analytics',
    description:
      'Track your sales, analyze market trends, and make data-driven decisions to grow your agricultural business.',
  },
]

export default function Features() {
  return (
    <section className="why-choose-section">
      <div className="section-head reveal-up">
        <span className="section-badge" style={{ background: '#dcfce7', color: '#16a34a', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold' }}>Why Choose AgroMitra?</span>
        <h2 style={{ fontSize: '40px', marginTop: '16px' }}>Everything needed for better farming</h2>
      </div>

      <div className="why-choose-grid">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className={`why-card reveal-up reveal-delay-${(index % 4) + 1}`}
          >
            <div className="why-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}