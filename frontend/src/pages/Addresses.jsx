import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import '../components/landing.css'

const EMPTY_FORM = {
  full_name: '', phone: '', address_line1: '', address_line2: '',
  city: '', state: '', pincode: '', country: 'India', is_default: false,
}

export default function Addresses() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => { init() }, [])

  async function init() {
    const { data: userData } = await supabase.auth.getUser()
    const u = userData?.user
    if (!u) { navigate('/buyer-login'); return }
    setUser(u)
    await fetchAddresses(u.id)
  }

  async function fetchAddresses(uid) {
    setLoading(true)
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', uid)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false })
    if (!error) setAddresses(data || [])
    setLoading(false)
  }

  function openAdd() {
    setEditId(null)
    setForm(EMPTY_FORM)
    setError('')
    setShowForm(true)
  }

  function openEdit(addr) {
    setEditId(addr.id)
    setForm({
      full_name: addr.full_name || '',
      phone: addr.phone || '',
      address_line1: addr.address_line1 || '',
      address_line2: addr.address_line2 || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || '',
      country: addr.country || 'India',
      is_default: addr.is_default || false,
    })
    setError('')
    setShowForm(true)
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.full_name || !form.phone || !form.address_line1 || !form.city || !form.state || !form.pincode) {
      setError('Please fill all required fields.')
      return
    }
    setSaving(true)
    setError('')

    try {
      // If setting as default, unset other defaults first
      if (form.is_default) {
        await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id)
      }

      if (editId) {
        const { error } = await supabase.from('addresses').update({ ...form }).eq('id', editId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('addresses').insert({ ...form, user_id: user.id })
        if (error) throw error
      }

      setSuccess(editId ? 'Address updated!' : 'Address added!')
      setShowForm(false)
      await fetchAddresses(user.id)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this address?')) return
    await supabase.from('addresses').delete().eq('id', id)
    await fetchAddresses(user.id)
  }

  async function handleSetDefault(id) {
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id)
    await supabase.from('addresses').update({ is_default: true }).eq('id', id)
    await fetchAddresses(user.id)
  }

  return (
    <section className="addr-page">
      <div className="addr-container">
        <div className="addr-header">
          <div>
            <span>My Account</span>
            <h1>Saved Addresses</h1>
            <p>Manage your delivery addresses.</p>
          </div>
          <div className="addr-header-actions">
            <button className="addr-add-btn" onClick={openAdd}>+ Add New Address</button>
            <Link to="/checkout" className="addr-back-link">← Back to Checkout</Link>
          </div>
        </div>

        {success && <div className="addr-success">{success}</div>}

        {showForm && (
          <div className="addr-form-card">
            <h2 className="addr-form-title">{editId ? 'Edit Address' : 'Add New Address'}</h2>
            {error && <div className="addr-error">{error}</div>}
            <form onSubmit={handleSave} className="addr-form">
              <div className="addr-form-row">
                <div className="addr-form-group">
                  <label>Full Name *</label>
                  <input name="full_name" value={form.full_name} onChange={handleChange} placeholder="John Doe" required />
                </div>
                <div className="addr-form-group">
                  <label>Phone *</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" required />
                </div>
              </div>
              <div className="addr-form-group">
                <label>Address Line 1 *</label>
                <input name="address_line1" value={form.address_line1} onChange={handleChange} placeholder="House No, Street" required />
              </div>
              <div className="addr-form-group">
                <label>Address Line 2</label>
                <input name="address_line2" value={form.address_line2} onChange={handleChange} placeholder="Landmark, Area (optional)" />
              </div>
              <div className="addr-form-row">
                <div className="addr-form-group">
                  <label>City *</label>
                  <input name="city" value={form.city} onChange={handleChange} placeholder="City" required />
                </div>
                <div className="addr-form-group">
                  <label>State *</label>
                  <input name="state" value={form.state} onChange={handleChange} placeholder="State" required />
                </div>
              </div>
              <div className="addr-form-row">
                <div className="addr-form-group">
                  <label>Pincode *</label>
                  <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="110001" required />
                </div>
                <div className="addr-form-group">
                  <label>Country</label>
                  <input name="country" value={form.country} onChange={handleChange} placeholder="India" />
                </div>
              </div>
              <label className="addr-default-check">
                <input type="checkbox" name="is_default" checked={form.is_default} onChange={handleChange} />
                Set as default address
              </label>
              <div className="addr-form-actions">
                <button type="submit" className="addr-save-btn" disabled={saving}>
                  {saving ? 'Saving...' : editId ? 'Update Address' : 'Save Address'}
                </button>
                <button type="button" className="addr-cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="addr-loading">Loading addresses...</div>
        ) : addresses.length === 0 ? (
          <div className="addr-empty">
            <div className="addr-empty-icon">📍</div>
            <h2>No addresses saved yet</h2>
            <p>Add a delivery address to continue shopping.</p>
            <button className="addr-add-btn" onClick={openAdd}>+ Add Address</button>
          </div>
        ) : (
          <div className="addr-list">
            {addresses.map((addr) => (
              <div key={addr.id} className={`addr-card${addr.is_default ? ' addr-card--default' : ''}`}>
                {addr.is_default && <span className="addr-default-badge">✓ Default</span>}
                <h3>{addr.full_name}</h3>
                <p className="addr-phone">📞 {addr.phone}</p>
                <p className="addr-text">
                  {addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ''}<br />
                  {addr.city}, {addr.state} – {addr.pincode}<br />
                  {addr.country}
                </p>
                <div className="addr-actions">
                  <button className="addr-edit-btn" onClick={() => openEdit(addr)}>Edit</button>
                  {!addr.is_default && (
                    <button className="addr-default-btn" onClick={() => handleSetDefault(addr.id)}>Set Default</button>
                  )}
                  <button className="addr-delete-btn" onClick={() => handleDelete(addr.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
