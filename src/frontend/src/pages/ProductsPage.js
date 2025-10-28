import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    featured: ''
  });
  
  const { addItem } = useCart();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data.categories);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.search) params.search = filters.search;
      if (filters.featured) params.featured = filters.featured;

      const response = await productsAPI.getAll(params);
      setProducts(response.data.products);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleAddToCart = (product) => {
    addItem(product);
  };

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem', textAlign: 'center' }}>
        Our Products
      </h1>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label htmlFor="search" className="form-label">Search</label>
          <input
            id="search"
            type="text"
            className="form-input"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="category" className="form-label">Category</label>
          <select
            id="category"
            className="filter-select"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="featured" className="form-label">Featured</label>
          <select
            id="featured"
            className="filter-select"
            value={filters.featured}
            onChange={(e) => handleFilterChange('featured', e.target.value)}
          >
            <option value="">All Products</option>
            <option value="true">Featured Only</option>
            <option value="false">Non-Featured</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading && (
        <div className="loading">
          <p>Loading products...</p>
        </div>
      )}

      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            Showing {products.length} product{products.length !== 1 ? 's' : ''}
          </div>
          
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  📦 Product Image
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-price">${product.price}</div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <span style={{ 
                      fontSize: '0.875rem', 
                      color: 'var(--text-secondary)' 
                    }}>
                      Stock: {product.stock}
                    </span>
                    <span style={{ 
                      fontSize: '0.75rem',
                      background: product.featured ? 'var(--warning-color)' : 'var(--background-color)',
                      color: product.featured ? 'white' : 'var(--text-secondary)',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '12px'
                    }}>
                      {product.featured ? 'Featured' : product.category}
                    </span>
                  </div>
                  <div className="product-actions">
                    <Link 
                      to={`/products/${product.id}`} 
                      className="btn btn-secondary"
                      style={{ flex: 1 }}
                    >
                      Details
                    </Link>
                    <button 
                      className="btn btn-primary"
                      style={{ flex: 1 }}
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                    >
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!loading && !error && products.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>No products found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Try adjusting your filters or search terms.
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => setFilters({ category: '', search: '', featured: '' })}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;