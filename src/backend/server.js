/**
 * Azure E-commerce Demo - Backend Server
 * © 2025 Azhar. All rights reserved.
 * 
 * Express.js server providing REST API for the e-commerce application
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// In-memory data store (will be replaced with databases in later modules)
let products = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 199.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    stock: 50,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracking with heart rate monitoring',
    price: 299.99,
    category: 'Wearables',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    stock: 30,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Premium Coffee Maker',
    description: 'Professional-grade coffee maker with programmable settings',
    price: 149.99,
    category: 'Appliances',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop',
    stock: 25,
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Wireless Gaming Mouse',
    description: 'Precision gaming mouse with customizable RGB lighting',
    price: 79.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
    stock: 75,
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Bluetooth Speaker',
    description: 'Portable waterproof speaker with deep bass',
    price: 129.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
    stock: 40,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Yoga Mat Premium',
    description: 'Non-slip eco-friendly yoga mat with carrying strap',
    price: 49.99,
    category: 'Sports',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop',
    stock: 60,
    featured: false,
    createdAt: new Date().toISOString()
  }
];

let orders = [];
let users = [];

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Products
app.get('/api/products', (req, res) => {
  const { category, featured, search } = req.query;
  let filteredProducts = [...products];

  if (category) {
    filteredProducts = filteredProducts.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (featured !== undefined) {
    filteredProducts = filteredProducts.filter(p => p.featured === (featured === 'true'));
  }

  if (search) {
    const searchTerm = search.toLowerCase();
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm)
    );
  }

  res.json({
    products: filteredProducts,
    total: filteredProducts.length
  });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

app.post('/api/products', (req, res) => {
  const { name, description, price, category, imageUrl, stock } = req.body;
  
  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Missing required fields: name, price, category' });
  }

  const newProduct = {
    id: (products.length + 1).toString(),
    name,
    description: description || '',
    price: parseFloat(price),
    category,
    imageUrl: imageUrl || '/images/placeholder.jpg',
    stock: parseInt(stock) || 0,
    featured: false,
    createdAt: new Date().toISOString()
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Categories
app.get('/api/categories', (req, res) => {
  const categories = [...new Set(products.map(p => p.category))];
  res.json({ categories });
});

// Orders
app.post('/api/orders', (req, res) => {
  const { items, totalAmount, customerInfo } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain items' });
  }

  if (!totalAmount || !customerInfo) {
    return res.status(400).json({ error: 'Missing required order information' });
  }

  const newOrder = {
    id: (orders.length + 1).toString(),
    items,
    totalAmount: parseFloat(totalAmount),
    customerInfo,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  orders.push(newOrder);
  res.status(201).json(newOrder);
});

app.get('/api/orders', (req, res) => {
  res.json({ orders });
});

app.get('/api/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 E-commerce API server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;