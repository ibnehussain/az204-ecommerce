# Module 01: Azure App Service - Basic E-commerce Web App

This module demonstrates a basic full-stack e-commerce web application using Node.js with Express for the backend and React for the frontend. The app serves a simple Product Catalog page with mock data.

## 🎯 Learning Objectives

- Set up a full-stack web application with Node.js/Express and React
- Create REST API endpoints to serve product data
- Build a responsive frontend that consumes the API
- Deploy the application to Azure App Service

## 🏗️ Application Architecture

```
┌─────────────────┐    HTTP/API Calls    ┌─────────────────┐
│   React Frontend │ ◄─────────────────► │ Express Backend │
│   (Port 3000)   │                      │   (Port 3001)   │
└─────────────────┘                      └─────────────────┘
         │                                         │
         │                                         │
    Static Files                           In-Memory Store
    - Product Catalog                      - Products Array
    - Shopping UI                          - Orders Array
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm package manager
- Git (for cloning)

### 1. Install Dependencies

```bash
# Backend dependencies
cd src/backend
npm install

# Frontend dependencies  
cd ../frontend
npm install
```

### 2. Set Up Environment Variables

```bash
# Copy environment template (from project root)
cp .env.example .env

# Edit .env file (minimal setup for local development)
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### 3. Start the Application

**Option A: Run Both Services Simultaneously**
```bash
# Terminal 1: Start Backend API Server
cd src/backend
npm start
# Server runs on http://localhost:3001

# Terminal 2: Start Frontend Development Server  
cd src/frontend
npm start
# App opens at http://localhost:3000
```

**Option B: Use Development Mode (Auto-restart)**
```bash
# Terminal 1: Backend with nodemon (auto-restart on changes)
cd src/backend
npm run dev

# Terminal 2: Frontend (already has hot-reload)
cd src/frontend  
npm start
```

### 4. Verify Installation

Open your browser and visit:
- **Frontend**: http://localhost:3000 - Product catalog page
- **Backend API**: http://localhost:3001/api/products - JSON product data
- **Health Check**: http://localhost:3001/api/health - API status

## 📁 Project Structure

```
src/
├── backend/              # Express.js API Server
│   ├── package.json      # Backend dependencies
│   ├── server.js         # Main server file with API routes
│   ├── jest.config.js    # Test configuration
│   └── src/test/         # API tests
└── frontend/             # React Application
    ├── package.json      # Frontend dependencies
    ├── public/           # Static files
    │   ├── index.html    # Main HTML template
    │   └── manifest.json # PWA manifest
    └── src/              # React source code
        ├── index.js      # React app entry point
        ├── App.js        # Main App component
        ├── App.css       # Application styles
        ├── components/   # Reusable React components
        │   ├── Header.js # Navigation header
        │   └── Footer.js # Page footer
        ├── pages/        # Page components
        │   ├── HomePage.js        # Landing page
        │   ├── ProductsPage.js    # Product catalog
        │   ├── ProductDetailPage.js # Product details
        │   ├── CartPage.js        # Shopping cart
        │   └── CheckoutPage.js    # Checkout flow
        ├── contexts/     # React Context for state
        │   └── CartContext.js # Shopping cart state
        └── services/     # API integration
            └── api.js    # HTTP client & API calls
```

## 🛠️ API Endpoints

The backend provides the following REST API endpoints:

### Products
- `GET /api/products` - Get all products (with optional filtering)
  - Query params: `category`, `featured`, `search`
  - Returns: `{ products: [], total: number }`
- `GET /api/products/:id` - Get single product by ID
- `POST /api/products` - Create new product (admin feature)

### Categories
- `GET /api/categories` - Get all product categories

### Orders  
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID

### System
- `GET /api/health` - Health check endpoint

### Example API Response
```json
{
  "products": [
    {
      "id": "1",
      "name": "Wireless Bluetooth Headphones",
      "description": "High-quality wireless headphones with noise cancellation",
      "price": 199.99,
      "category": "Electronics",
      "imageUrl": "/images/headphones.jpg",
      "stock": 50,
      "featured": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 1
}
```

## 🎨 Frontend Features

### Product Catalog
- Display products in a responsive grid layout
- Filter by category and search by name/description
- Featured products highlighting
- Product detail pages with full information

### Shopping Cart
- Add/remove products
- Update quantities
- Persistent cart state (localStorage)
- Cart summary with totals

### User Interface
- Responsive design (mobile-friendly)
- Modern CSS with custom properties
- Loading states and error handling
- Navigation with React Router

## 🧪 Testing

### Backend Tests
```bash
cd src/backend
npm test                # Run all tests
npm run test:watch     # Run tests in watch mode
```

### Frontend Tests
```bash
cd src/frontend
npm test               # Run React tests
npm test -- --coverage # Run with coverage report
```

## 🔧 Development Tips

### Hot Reload
- **Frontend**: Automatically reloads on file changes
- **Backend**: Use `npm run dev` for auto-restart with nodemon

### API Testing
Use tools like Postman, curl, or your browser:
```bash
# Test product endpoint
curl http://localhost:3001/api/products

# Test with search
curl "http://localhost:3001/api/products?search=headphones"

# Health check
curl http://localhost:3001/api/health
```

### Debugging
- **Backend**: Console logs appear in Terminal 1
- **Frontend**: Check browser Developer Tools console
- **Network**: Use browser Network tab to inspect API calls

## 📊 Data Structure

### Products (In-Memory Store)
Each product has the following structure:
```javascript
{
  id: string,           // Unique identifier
  name: string,         // Product name
  description: string,  // Product description
  price: number,        // Price in USD
  category: string,     // Product category
  imageUrl: string,     // Image path/URL
  stock: number,        // Available quantity
  featured: boolean,    // Featured product flag
  createdAt: string     // ISO timestamp
}
```

## 🚀 Ready for Azure Deployment

This basic web app is designed to be deployed to Azure App Service in the next steps. The application includes:

- **Environment Configuration**: Ready for Azure App Service settings
- **Health Endpoints**: For Azure health monitoring
- **CORS Setup**: Configured for production domains
- **Process Management**: Proper startup and error handling
- **Static File Serving**: Ready for production build deployment

## 🔄 Next Steps

After running the app locally:

1. **Deploy to Azure App Service** (covered in deployment guide)
2. **Add Azure Functions** (Module 02)
3. **Integrate Azure Blob Storage** (Module 03)
4. **Replace with Azure Cosmos DB** (Module 04)

## 🆘 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Kill processes on ports 3000/3001
npx kill-port 3000
npx kill-port 3001
```

**Module Not Found**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**CORS Errors**
- Ensure backend is running on port 3001
- Frontend proxy is configured in package.json

**API Not Responding**
- Check backend terminal for errors
- Verify http://localhost:3001/api/health responds
- Check firewall/antivirus settings

### Getting Help
- Check the console logs in both terminals
- Verify all dependencies are installed
- Ensure Node.js version 18+ is being used
- Review the `.env` file configuration

---

**🎉 Congratulations!** You now have a working full-stack e-commerce web application. The app demonstrates modern web development practices and is ready for Azure deployment.