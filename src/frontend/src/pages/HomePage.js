import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../services/api';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getAll({ featured: 'true' });
        setFeaturedProducts(response.data.products);
      } catch (err) {
        setError('Failed to load featured products');
        console.error('Error fetching featured products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <h1 className="hero-title">Welcome to Azure E-commerce</h1>
          <p className="hero-subtitle">
            Discover amazing products in our progressive Azure-powered demo store
          </p>
          <Link to="/products" className="btn btn-primary" style={{ fontSize: '1.1rem' }}>
            Shop Now
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '3rem 0', background: 'var(--surface-color)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>
            Azure Services Showcase
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'var(--primary-color)',
                borderRadius: '50%',
                margin: '0 auto 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.5rem'
              }}>
                🚀
              </div>
              <h3 style={{ marginBottom: '1rem' }}>App Service</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Scalable web application hosting with built-in CI/CD and monitoring
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'var(--success-color)',
                borderRadius: '50%',
                margin: '0 auto 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.5rem'
              }}>
                ⚡
              </div>
              <h3 style={{ marginBottom: '1rem' }}>Azure Functions</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Serverless computing for background processing and API endpoints
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'var(--warning-color)',
                borderRadius: '50%',
                margin: '0 auto 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.5rem'
              }}>
                🗄️
              </div>
              <h3 style={{ marginBottom: '1rem' }}>Cosmos DB</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Globally distributed NoSQL database for product and order data
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section style={{ padding: '3rem 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>
            Featured Products
          </h2>
          
          {loading && (
            <div className="loading">
              <p>Loading featured products...</p>
            </div>
          )}
          
          {error && (
            <div className="error">
              <p>{error}</p>
            </div>
          )}
          
          {!loading && !error && (
            <div className="products-grid">
              {featuredProducts.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    📦 Product Image
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <div className="product-price">${product.price}</div>
                    <Link 
                      to={`/products/${product.id}`} 
                      className="btn btn-primary"
                      style={{ width: '100%' }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!loading && !error && featuredProducts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>No featured products available.</p>
              <Link to="/products" className="btn btn-primary">
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;