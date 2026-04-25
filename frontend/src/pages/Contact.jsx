import React, { useState } from 'react'
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock3,
  MessageSquareText,
} from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const { error: dbError } = await supabase
        .from('contact_messages')
        .insert([formData])

      if (dbError) throw dbError

      setSuccess('Message submitted successfully. We will get back to you soon!')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      console.error('Contact error:', err)
      setError(err.message || 'Failed to send message. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="contact-page-pro">
      <div className="contact-container-pro">
        <div className="contact-header-pro text-center">
          <span className="contact-badge">Contact Us</span>
          <h1>Get in touch</h1>
          <p>
            Have questions about our products, support, or agricultural
            services? Our team is here to help you quickly and professionally.
          </p>
        </div>

        <div className="contact-grid-pro">
          {/* Left Column - Contact Info */}
          <div className="contact-info-card">
            <div className="info-header">
              <h2>Contact Information</h2>
              <p>Fill out the form and our support team will get back to you as soon as possible.</p>
            </div>

            <div className="info-list">
              <div className="info-item">
                <div className="info-icon"><Phone size={22} /></div>
                <div>
                  <span>Phone</span>
                  <p>+91 98765 43210</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon"><Mail size={22} /></div>
                <div>
                  <span>Email</span>
                  <p>support@agromitra.com</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon"><MapPin size={22} /></div>
                <div>
                  <span>Address</span>
                  <p>123 Greenfield Road,<br />Agriland, IN 452001</p>
                </div>
              </div>
            </div>

            <div className="info-boxes">
              <div className="info-box">
                <div className="box-head">
                  <Clock3 size={18} />
                  <p>Working Hours</p>
                </div>
                <span>Monday - Saturday<br />9:00 AM - 6:00 PM</span>
              </div>

              <div className="info-box">
                <div className="box-head">
                  <MessageSquareText size={18} />
                  <p>Quick Response</p>
                </div>
                <span>Most queries are answered<br />within 24 hours</span>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="contact-form-card">
            <h2>Send us a message</h2>
            <p>Tell us what you need and our team will contact you soon.</p>

            <form onSubmit={handleSubmit} className="contact-form-pro">
              <div className="form-row-2">
                <div className="form-group">
                  <label>Your name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  required
                />
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  rows="5"
                  required
                />
              </div>

              {success && <div className="form-alert success">{success}</div>}
              {error && <div className="form-alert error">{error}</div>}

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? 'Sending...' : 'Send Message'}
                {!loading && <Send size={18} />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}