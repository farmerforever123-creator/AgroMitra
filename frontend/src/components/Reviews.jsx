import './landing.css'

const testimonials = [
  {
    name: 'Rajesh Kumar',
    role: 'Wheat Farmer, Punjab',
    text: 'AgroMitra changed how I sell my harvest. I used to rely on middlemen who took a huge cut, but now I sell directly to verified buyers at market price.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
  },
  {
    name: 'Anita Devi',
    role: 'Organic Veg Seller, Haryana',
    text: 'The dashboard is so easy to use. I listed my organic tomatoes and got 5 bulk orders in the first week. The secure payment system gives me peace of mind.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
  },
  {
    name: 'Suresh Patel',
    role: 'Retail Buyer, Gujarat',
    text: 'Finding quality agricultural products was a hassle before. With AgroMitra, I can connect directly with real farmers. The quality of produce has never been better.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
  },
]

export default function Reviews() {
  return (
    <section className="testimonials-section">
      <div className="section-head reveal-up">
        <span className="section-badge" style={{ background: '#dcfce7', color: '#16a34a', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold' }}>Testimonials</span>
        <h2 style={{ fontSize: '40px', marginTop: '16px' }}>What Farmers Are Saying</h2>
      </div>

      <div className="testimonials-grid">
        {testimonials.map((testi, index) => (
          <div key={testi.name} className={`testi-card reveal-up reveal-delay-${(index % 4) + 1}`}>
            <span className="testi-quote">"</span>
            <p className="testi-text">"{testi.text}"</p>
            <div className="testi-user">
              <img src={testi.image} alt={testi.name} className="testi-avatar" />
              <div>
                <strong>{testi.name}</strong>
                <span>{testi.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}