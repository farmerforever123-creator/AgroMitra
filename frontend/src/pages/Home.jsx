import React from 'react'
import ProductCard from '../components/ProductCard'

const DUMMY_PRODUCTS = [
  {
    id: 1,
    name: 'Premium Urea Fertilizer (50kg)',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1628189679624-9b2447eb59bf?w=500&q=80',
  },
  {
    id: 2,
    name: 'High Yield Wheat Seeds (10kg)',
    price: 850,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative h-[500px] overflow-hidden bg-black">
        <video
          controls
          playsInline
          preload="auto"
          poster="/hero.png"
          className="w-full h-full object-cover"
        >
          <source src="/hero-fixed.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center px-4 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg tracking-tight">
              Empowering Every Farmer&apos;s Journey
            </h1>
            <p className="text-xl md:text-2xl text-green-50 mb-8 font-light drop-shadow">
              Get the best quality seeds, fertilizers, and agricultural equipment delivered right to your farm.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-10 border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-gray-500 mt-2">Handpicked essentials for your next harvest</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {DUMMY_PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              image={product.image}
              name={product.name}
              price={product.price}
            />
          ))}
        </div>
      </section>
    </div>
  )
}