import { useEffect, useState } from 'react'
import './landing.css'

export default function Preloader({ children }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="preloader">
        <div className="spinner"></div>
        <h1>AgroMitra</h1>
        <p>Loading fresh farming marketplace...</p>
      </div>
    )
  }

  return children
}