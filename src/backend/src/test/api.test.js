const request = require('supertest');
const app = require('../../server');

describe('E-commerce API', () => {
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('version');
    });
  });

  describe('GET /api/products', () => {
    it('should return products list', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body).toHaveProperty('products');
      expect(response.body).toHaveProperty('total');
      expect(Array.isArray(response.body.products)).toBe(true);
    });

    it('should filter products by category', async () => {
      const response = await request(app)
        .get('/api/products?category=Electronics')
        .expect(200);

      response.body.products.forEach(product => {
        expect(product.category).toBe('Electronics');
      });
    });

    it('should search products by name', async () => {
      const response = await request(app)
        .get('/api/products?search=headphones')
        .expect(200);

      response.body.products.forEach(product => {
        expect(product.name.toLowerCase()).toContain('headphones');
      });
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a specific product', async () => {
      const response = await request(app)
        .get('/api/products/1')
        .expect(200);

      expect(response.body).toHaveProperty('id', '1');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('price');
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .get('/api/products/999')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Product not found');
    });
  });

  describe('POST /api/orders', () => {
    it('should create a new order', async () => {
      const orderData = {
        items: [
          { productId: '1', name: 'Test Product', price: 100, quantity: 2 }
        ],
        totalAmount: 200,
        customerInfo: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890'
        }
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('status', 'pending');
      expect(response.body.totalAmount).toBe(200);
    });

    it('should validate required order fields', async () => {
      const invalidOrder = {
        items: [],
        totalAmount: 100
      };

      const response = await request(app)
        .post('/api/orders')
        .send(invalidOrder)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/categories', () => {
    it('should return list of categories', async () => {
      const response = await request(app)
        .get('/api/categories')
        .expect(200);

      expect(response.body).toHaveProperty('categories');
      expect(Array.isArray(response.body.categories)).toBe(true);
    });
  });
});