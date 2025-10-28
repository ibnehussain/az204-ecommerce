import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItem, getItemQuantity } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getById(id);
        setProduct(response.data);
      } catch (err) {
        setError('Product not found');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container">
        <div className="error">
          <p>{error || 'Product not found'}</p>
          <Link to="/products" className="btn btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const itemQuantity = getItemQuantity(product.id);

  return (
    <div className="container">
      <Link to="/products" style={{ 
        color: 'var(--primary-color)', 
        textDecoration: 'none',
        marginBottom: '2rem',
        display: 'inline-block'
      }}>
        ← Back to Products
      </Link>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '3rem',
        alignItems: 'start'
      }}>
        <div>
          <div style={{
            width: '100%',
            height: '400px',
            background: '#f8f9fa',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            fontSize: '4rem'
          }}>
            📦
          </div>
        </div>

        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            {product.name}
          </h1>

          <div style={{
            fontSize: '2rem',
            color: 'var(--primary-color)',
            fontWeight: '700',
            marginBottom: '1rem'
          }}>
            ${product.price}
          </div>

          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <span style={{
              background: 'var(--background-color)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.875rem'
            }}>
              {product.category}
            </span>
            {product.featured && (
              <span style={{
                background: 'var(--warning-color)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.875rem'
              }}>
                Featured
              </span>
            )}
          </div>

          <p style={{
            fontSize: '1.1rem',
            lineHeight: '1.6',
            color: 'var(--text-secondary)',
            marginBottom: '2rem'
          }}>
            {product.description}
          </p>

          <div style={{
            background: 'var(--surface-color)',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '2rem'
          }}>
            <h3 style={{ marginBottom: '1rem' }}>Product Details</h3>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Stock:</span>
                <span style={{ fontWeight: '600' }}>{product.stock} available</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Category:</span>
                <span style={{ fontWeight: '600' }}>{product.category}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Product ID:</span>
                <span style={{ fontWeight: '600' }}>{product.id}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              className="btn btn-primary"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              style={{ flex: 1, fontSize: '1.1rem' }}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            
            {itemQuantity > 0 && (
              <span style={{
                background: 'var(--success-color)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.875rem'
              }}>
                {itemQuantity} in cart
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;