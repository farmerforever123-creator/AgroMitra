import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import axios from 'axios'
import { useLanguage } from '../context/LanguageContext'
import '../components/landing.css'

const STATUS_LABELS = {
  placed:     { label: 'Placed',      cls: 'status--placed' },
  confirmed:  { label: 'Confirmed',   cls: 'status--paid' },
  processing: { label: 'Processing',  cls: 'status--processing' },
  shipped:    { label: 'Shipped',     cls: 'status--shipped' },
  delivered:  { label: 'Delivered',   cls: 'status--delivered' },
  cancelled:  { label: 'Cancelled',   cls: 'status--cancelled' },
}

// Payment Labels mapping – handles database-normalized values
const PAYMENT_LABELS = {
  pending:     { label: 'Payment Pending', cls: 'status--pending' },
  paid:        { label: 'Paid',            cls: 'status--paid' },
  failed:      { label: 'Failed',          cls: 'status--failed' },
  cod_pending: { label: 'COD Pending',     cls: 'status--cod' },
}

/** Safely shorten any order ID (UUID string, integer, or undefined) */
function shortOrderId(id) {
  return String(id ?? '').slice(0, 8).toUpperCase() || '—'
}

/** Safely format a date string; returns '—' if invalid */
function formatDate(raw) {
  if (!raw) return '—'
  try {
    return new Date(raw).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  } catch {
    return '—'
  }
}

export default function MyOrders() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { init() }, [])

  async function init() {
    // 1. Get current user
    const { data: userData } = await supabase.auth.getUser()
    const u = userData?.user
    console.log("CURRENT USER:", u)
    if (!u) { navigate('/buyer-login'); return }

    const token = localStorage.getItem('token')

    // 2. Try backend API first (bypasses RLS)
    try {
      const res = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log("FETCHED ORDERS (API):", res.data)

      const fetchedOrders = res.data?.orders || res.data || []
      if (fetchedOrders.length > 0) {
        setOrders(fetchedOrders)
        setLoading(false)
        return
      }
    } catch (apiErr) {
      console.error("API fetch failed, trying Supabase direct:", apiErr.message)
    }

    // 3. Fallback: Direct Supabase query
    let { data, error: queryError } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .or(`user_id.eq.${u.id},buyer_id.eq.${u.id}`)
      .order('created_at', { ascending: false })

    console.log("FETCHED ORDERS (Supabase):", data)
    console.log("ORDER ERROR:", queryError)

    // 4. If join fails (order_items relation issue), try simple query
    if (queryError) {
      console.warn("Retrying without order_items join...")
      const { data: simpleData, error: simpleError } = await supabase
        .from('orders')
        .select('*')
        .or(`user_id.eq.${u.id},buyer_id.eq.${u.id}`)
        .order('created_at', { ascending: false })

      if (simpleError) {
        setError(`Could not fetch orders: ${simpleError.message}`)
      } else {
        setOrders(simpleData || [])
      }
    } else {
      setOrders(data || [])
    }

    setLoading(false)
  }

  if (loading) return <div className="orders-loading">Loading your orders...</div>

  return (
    <section className="orders-page">
      <div className="orders-container">
        <div className="orders-header">
          <span>My Account</span>
          <h1>{t('ordersPage.title')}</h1>
          <p>Track all your purchases from AgroMitra.</p>
        </div>

        {error && <div className="orders-error">{error}</div>}

        {orders.length === 0 ? (
          <div className="orders-empty">
            <div className="orders-empty-icon">📦</div>
            <h2>{t('ordersPage.noOrders')}</h2>
            <p>Start shopping to see your orders here.</p>
            <Link to="/products" className="orders-shop-btn">Explore Products</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              // ── safe field access ──────────────────────────────────────
              const orderId      = shortOrderId(order?.id)
              const date         = formatDate(order?.created_at)
              const totalAmount  = order?.total_amount ?? '—'
              const statusKey    = order?.status ?? ''
              const payStatusKey = order?.payment_status ?? ''
              const payMethod    = order?.payment_method ?? ''
              const addr         = order?.addresses ?? null
              const items        = Array.isArray(order?.order_items) ? order.order_items : []

              const statusInfo = STATUS_LABELS[statusKey.toLowerCase()]
                ?? { label: statusKey || 'Unknown', cls: 'status--placed' }
              const payInfo = PAYMENT_LABELS[payStatusKey.toLowerCase()]
                ?? { label: payStatusKey || 'Unknown', cls: 'status--pending' }

              return (
                <div key={order?.id ?? Math.random()} className="order-card">
                  <div className="order-card-top">
                    <div className="order-meta">
                      <div>
                        <span className="order-label">{t('ordersPage.orderId')}</span>
                        <span className="order-id">#{orderId}</span>
                      </div>
                      <div>
                        <span className="order-label">{t('ordersPage.date')}</span>
                        <span className="order-date">{date}</span>
                      </div>
                      <div>
                        <span className="order-label">Total</span>
                        <span className="order-total">
                          {totalAmount !== '—' ? `₹${totalAmount}` : '—'}
                        </span>
                      </div>
                    </div>

                    <div className="order-badges">
                      <span className={`order-status ${statusInfo.cls}`}>
                        {statusInfo.label}
                      </span>
                      <span className={`order-status ${payInfo.cls}`}>
                        {payInfo.label}
                      </span>
                      <span className="order-pay-method">
                        {payMethod.toLowerCase() === 'cod' ? '💵 COD' : '📱 UPI'}
                      </span>
                    </div>
                  </div>

                  {/* Order items */}
                  <div className="order-items-list">
                    {items.length > 0 ? items.map((item, idx) => {
                      const itemId    = item?.id ?? idx
                      const name      = item?.product_name || 'Product'
                      const qty       = Number(item?.quantity ?? 0)
                      const price     = Number(item?.price ?? 0)
                      const lineTotal = price * qty

                      return (
                        <div key={itemId} className="order-item-row">
                          <span className="order-item-name">{name}</span>
                          <span>Qty: {qty}</span>
                          <span>₹{price} each</span>
                          <strong>₹{lineTotal}</strong>
                        </div>
                      )
                    }) : (
                      <p style={{ margin: 0, color: '#94a3b8', fontSize: 14 }}>
                        No item details available.
                      </p>
                    )}
                  </div>

                  {/* Delivery address */}
                  {addr && (
                    <div className="order-address">
                      📍{' '}
                      {[
                        addr.full_name,
                        addr.address_line1,
                        addr.city,
                        addr.state,
                        addr.pincode ? `– ${addr.pincode}` : '',
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
