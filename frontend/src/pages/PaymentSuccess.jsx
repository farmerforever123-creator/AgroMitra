import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../components/landing.css'

export default function PaymentSuccess() {
  const { state } = useLocation()
  const [visible, setVisible] = useState(false)

  // Animate in on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60)
    return () => clearTimeout(t)
  }, [])

  const orderId   = state?.orderId   ?? null
  const amount    = state?.amount    ?? null
  const method    = state?.method    ?? null

  const shortId = orderId ? String(orderId).slice(0, 8).toUpperCase() : null

  const methodLabel =
    method === 'cod' ? '💵 Cash on Delivery' :
    method === 'upi' ? '📱 UPI'              :
    null

  return (
    <section className="paysuccess-page">
      <div className={`paysuccess-card${visible ? ' paysuccess-card--in' : ''}`}>

        {/* Animated tick */}
        <div className="paysuccess-icon-wrap">
          <div className="paysuccess-icon">
            <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="26" cy="26" r="25" stroke="#16a34a" strokeWidth="2" fill="#f0fdf4" className="paysuccess-circle" />
              <path d="M14 27l9 9 15-16" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="paysuccess-tick" />
            </svg>
          </div>
        </div>

        <h1 className="paysuccess-heading">Payment Done!</h1>
        <p className="paysuccess-sub">Your order has been placed successfully 🎉</p>

        {/* Order details */}
        <div className="paysuccess-details">
          {shortId && (
            <div className="paysuccess-row">
              <span>Order ID</span>
              <strong>#{shortId}</strong>
            </div>
          )}
          {amount != null && (
            <div className="paysuccess-row">
              <span>Amount Paid</span>
              <strong>₹{amount}</strong>
            </div>
          )}
          {methodLabel && (
            <div className="paysuccess-row">
              <span>Payment Method</span>
              <strong>{methodLabel}</strong>
            </div>
          )}
          <div className="paysuccess-row">
            <span>Status</span>
            <span className="paysuccess-status-badge">✅ Order Placed</span>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="paysuccess-actions">
          <Link to="/my-orders" className="paysuccess-btn-primary">
            📦 View My Orders
          </Link>
          <Link to="/products" className="paysuccess-btn-secondary">
            🛒 Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  )
}
