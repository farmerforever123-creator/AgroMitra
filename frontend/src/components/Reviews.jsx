import './landing.css'

const reviews = [
  {
    name: 'Rohit Sharma',
    role: 'Buyer',
    review:
      'AgroMitra made it very easy for me to find fresh farm products at fair prices. The interface feels modern and trustworthy.',
  },
  {
    name: 'Anjali Verma',
    role: 'Customer',
    review:
      'I really liked how smooth the platform feels. Browsing products and exploring options is simple and premium.',
  },
  {
    name: 'Mahesh Yadav',
    role: 'Farmer',
    review:
      'This platform can really help farmers reach more buyers directly. The design is clean, clear, and professional.',
  },
]

export default function Reviews() {
  return (
    <section className="section reviews-section premium-reviews-section">
      <div className="container">
        <div className="section-head reveal-up">
          <span className="section-badge">Customer Reviews</span>
          <h2>What people say about AgroMitra</h2>
          <p>
            A premium marketplace experience should feel simple, reliable, and
            valuable for both farmers and buyers.
          </p>
        </div>

        <div className="review-grid premium-review-grid">
          {reviews.map((item, index) => (
            <div
              key={item.name}
              className={`review-card premium-review-card reveal-up reveal-delay-${(index % 3) + 1}`}
            >
              <div className="stars">★★★★★</div>
              <p>“{item.review}”</p>
              <div className="review-user">
                <div className="review-avatar">{item.name.charAt(0)}</div>
                <div>
                  <h3>{item.name}</h3>
                  <span>{item.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}