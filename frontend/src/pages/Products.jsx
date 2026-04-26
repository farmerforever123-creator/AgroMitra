import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useLanguage } from '../context/LanguageContext'
import ProductCard from '../components/ProductCard'
import '../components/landing.css'

const CATEGORIES = [
  { name: 'Seeds', slug: 'seeds', icon: '🌱' },
  { name: 'Pesticides', slug: 'pesticides', icon: '🛡️' },
  { name: 'Insecticides', slug: 'insecticides', icon: '🐛' },
  { name: 'Farming Tools', slug: 'farming-tools', icon: '🚜' }
]

export default function Products() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('default')
  const [error, setError] = useState(null)

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role === 'seller' || role === 'farmer') {
      navigate('/seller-dashboard');
      return;
    }
    fetchProducts()
  }, [navigate])

  async function fetchProducts() {
    setLoading(true)
    setError(null)

    const { data, error: err } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    console.log("FETCHED PRODUCTS:", data)

    if (err) {
      console.error(err)
      setError('Failed to load products. Please try again.')
    } else {
      setProducts(data || [])
    }

    setLoading(false)
  }

  const filteredProducts = useMemo(() => {
    let data = [...products]

    // Filter by Search
    if (search.trim()) {
      const q = search.toLowerCase()
      data = data.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      )
    }

    // Sort
    if (sortBy === 'low') {
      data.sort((a, b) => Number(a.price) - Number(b.price))
    }
    if (sortBy === 'high') {
      data.sort((a, b) => Number(b.price) - Number(a.price))
    }

    return data
  }, [products, search, sortBy])

  if (loading) {
    return (
      <section className="products-page-pro">
        <div className="products-container-pro">
           <div className="products-loading">
             <div className="loader-spinner"></div>
             <p>{t('productsPage.title')} Loading...</p>
           </div>
        </div>
      </section>
    )
  }

  return (
    <section className="products-page-pro">
      <div className="products-container-pro">
        <div className="products-hero-mini">
          <div>
            <span>AgroMitra Marketplace</span>
            <h1>{t('productsPage.title')}</h1>
            <p>Explore seeds, fertilizers, tools, vegetables and more.</p>
          </div>

          <div className="products-controls-pro">
            <input
              type="text"
              placeholder={t('productsPage.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="default">Sort: Default</option>
              <option value="low">Price Low to High</option>
              <option value="high">Price High to Low</option>
            </select>
          </div>
        </div>

        {error ? (
          <div className="products-error-pro">
            <h2>Oops!</h2>
            <p>{error}</p>
            <button onClick={fetchProducts} className="retry-btn">Retry</button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="products-empty-pro">
            <h2>No products found</h2>
            <p>Try a different search keyword.</p>
          </div>
        ) : (
          <>
            {/* All Products Section */}
            <div className="category-product-section">
              <div className="category-section-head">
                <h2>{t('productsPage.title')}</h2>
                <span>{filteredProducts.length} Items</span>
              </div>
              
              <div className="shop-products-row">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>

            {/* Shop by Category Section */}
            <div className="category-product-section mt-12">
              <div className="category-section-head">
                <h2>Shop by Category</h2>
              </div>
              
              <div className="category-cards-grid">
                {CATEGORIES.map((cat) => (
                  <div 
                    key={cat.slug} 
                    className="category-card-pro"
                    onClick={() => navigate(`/products/category/${cat.slug}`)}
                  >
                    <div className="cat-icon">{cat.icon}</div>
                    <h3>{cat.name}</h3>
                    <p>Explore {cat.name} →</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}