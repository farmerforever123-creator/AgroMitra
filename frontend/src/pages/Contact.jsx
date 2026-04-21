import React, { useState } from 'react'
import { Mail, Phone, MapPin, Send, Clock3, MessageSquareText } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    console.log('Contact form:', formData)
  }

  return (
    <section className="bg-gradient-to-br from-slate-50 via-white to-green-50 min-h-[calc(100vh-80px)] px-4 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-semibold mb-4">
            Contact Us
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Get in touch
          </h1>
          <p className="text-lg text-slate-500 leading-8">
            Have questions about our products, support, or agricultural services?
            Our team is here to help you quickly and professionally.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr,1.35fr] gap-8 items-stretch">
          <div className="bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 rounded-3xl p-8 sm:p-10 text-white shadow-[0_20px_80px_rgba(16,185,129,0.18)]">
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-3">Contact Information</h2>
              <p className="text-green-50/90 leading-7">
                Fill out the form and our support team will get back to you as
                soon as possible.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                  <Phone size={22} />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-wide text-green-100">
                    Phone
                  </p>
                  <p className="text-lg font-semibold">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                  <Mail size={22} />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-wide text-green-100">
                    Email
                  </p>
                  <p className="text-lg font-semibold">support@agromitra.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                  <MapPin size={22} />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-wide text-green-100">
                    Address
                  </p>
                  <p className="text-lg font-semibold leading-8">
                    123 Greenfield Road,
                    <br />
                    Agriland, IN 452001
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 grid sm:grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <Clock3 size={18} />
                  <p className="font-semibold">Working Hours</p>
                </div>
                <p className="text-sm text-green-50/90 leading-6">
                  Monday - Saturday
                  <br />
                  9:00 AM - 6:00 PM
                </p>
              </div>

              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <MessageSquareText size={18} />
                  <p className="font-semibold">Quick Response</p>
                </div>
                <p className="text-sm text-green-50/90 leading-6">
                  Most queries are answered
                  <br />
                  within 24 hours
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_20px_80px_rgba(0,0,0,0.06)] p-6 sm:p-8 lg:p-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Send us a message
            </h2>
            <p className="text-slate-500 mb-8">
              Tell us what you need and our team will contact you soon.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Your name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  rows="6"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none resize-none focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 transition"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-14 px-8 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-semibold text-base shadow-lg shadow-green-200 transition-all"
              >
                Send Message
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}