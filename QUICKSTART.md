# 🚀 Quick Start Guide - Azure E-commerce Demo

This guide will help you get the full-stack e-commerce web application running locally in just a few minutes.

## ⚡ Super Quick Start

### Option A: Windows Users (Recommended)
```bash
# 1. Install all dependencies
npm run install:all

# 2. Run the startup script
.\start.bat
# OR for PowerShell: .\start.ps1

# 3. Browser will automatically open to http://localhost:3000
```

### Option B: Manual Start
```bash
# 1. Install all dependencies
npm run install:all

# 2. Start backend (Terminal 1)
npm run start:backend

# 3. Start frontend (Terminal 2) 
npm run start:frontend

# 4. Open browser to http://localhost:3000
```

That's it! Your e-commerce app is now running.

## 📋 Prerequisites Checklist

Before starting, make sure you have:
- [ ] **Node.js 18+** (`node --version`)
- [ ] **npm** (`npm --version`)  
- [ ] **Git** (if you cloned the repository)
- [ ] **Web browser** (Chrome, Firefox, Safari, Edge)

## 🎯 What You'll See

After running the commands above:

### Frontend (http://localhost:3000)
- **Homepage**: Welcome page with featured products
- **Products Page**: Complete catalog with search and filters
- **Shopping Cart**: Add/remove items, view totals
- **Product Details**: Individual product pages

### Backend API (http://localhost:3001)
- **Products Endpoint**: http://localhost:3001/api/products
- **Health Check**: http://localhost:3001/api/health
- **Categories**: http://localhost:3001/api/categories

## 🔧 Detailed Setup Instructions

### Step 1: Install Dependencies

```bash
# Option A: Install everything at once (recommended)
npm run install:all

# Option B: Install separately
cd src/backend && npm install
cd ../frontend && npm install
cd ../..
```

### Step 2: Environment Configuration (Optional)

```bash
# Copy environment template
cp .env.example .env

# The defaults work for local development, but you can customize:
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### Step 3: Start the Application

**Recommended: Use Startup Scripts (Windows)**
```bash
# Batch file (opens in separate windows)
.\start.bat

# OR PowerShell script
.\start.ps1
```

**Alternative: Manual Start**
```bash
# Terminal 1: Backend
npm run start:backend
# OR for auto-reload: npm run dev:backend

# Terminal 2: Frontend  
npm run start:frontend
```

## ✅ Verification Steps

### 1. Check Backend API
Open these URLs in your browser:

- **Health Check**: http://localhost:3001/api/health
  - Should return: `{"status":"healthy","timestamp":"...","version":"1.0.0"}`

- **Products API**: http://localhost:3001/api/products  
  - Should return JSON with product array

### 2. Check Frontend Application
- **Main App**: http://localhost:3000
  - Should show the e-commerce homepage
  - Navigation should work (Home, Products, Cart)

### 3. Test Integration
- Click "Products" in navigation
- You should see product cards loaded from the API
- Try adding items to cart
- Cart counter should update in header

## 📱 Application Features Demo

### Product Catalog
1. Navigate to **Products** page
2. Try the **search box** (e.g., search "headphones")
3. Use **category filter** (select "Electronics")
4. Click **"View Details"** on any product

### Shopping Cart
1. Click **"Add to Cart"** on any product
2. Notice the **cart counter** in header updates
3. Click **"Cart"** in navigation to view items
4. Try **changing quantities** or **removing items**

### Responsive Design
1. Resize your browser window
2. Try on mobile device or mobile viewport
3. All features should work on different screen sizes

## 🛠️ Development Commands

```bash
# Install dependencies for both apps
npm run install:all

# Start development servers (with auto-reload)
npm run dev

# Start production mode
npm start

# Run all tests
npm test

# Run linting
npm run lint

# Build frontend for production
npm run build
```

## 🐛 Troubleshooting

### Issue: "Port 3000 is already in use"
```bash
# Kill the process using port 3000
npx kill-port 3000

# Or use a different port
cd src/frontend
PORT=3002 npm start
```

### Issue: "Port 3001 is already in use"
```bash
# Kill the process using port 3001
npx kill-port 3001

# Or change backend port in .env
PORT=3002
```

### Issue: "Cannot GET /api/products"
- Ensure backend is running on port 3001
- Check backend terminal for error messages
- Verify: http://localhost:3001/api/health

### Issue: Frontend shows blank page
- Check browser console for errors (F12)
- Ensure frontend is running on port 3000
- Check React development server messages

### Issue: "Module not found" errors
```bash
# Reinstall dependencies
cd src/backend && rm -rf node_modules package-lock.json && npm install
cd ../frontend && rm -rf node_modules package-lock.json && npm install
```

### Issue: API calls failing with CORS errors
- Ensure backend URL is correct in frontend
- Check that proxy is configured in frontend/package.json
- Backend should show CORS middleware is loaded

## 🎓 Understanding the Code

### Backend Structure (src/backend/)
- **server.js**: Express server with API routes
- **Mock Data**: Products stored in memory (will use databases later)
- **Middleware**: CORS, security headers, logging
- **API Routes**: Products, orders, categories, health

### Frontend Structure (src/frontend/src/)  
- **App.js**: Main component with routing
- **pages/**: Different page components
- **components/**: Reusable UI components
- **contexts/**: State management (cart)
- **services/**: API integration

### Key Technologies
- **Backend**: Node.js, Express, CORS, Morgan logging
- **Frontend**: React 18, React Router, Context API
- **Development**: Nodemon (auto-reload), React hot reload
- **Testing**: Jest (backend), React Testing Library (frontend)

## 🚀 Next Steps

Once you have the app running locally:

1. **Explore the Code**: Look at the file structure and understand the data flow
2. **Test All Features**: Products, cart, search, filtering
3. **Make Changes**: Try modifying products in `server.js`
4. **Deploy to Azure**: Follow the Azure App Service deployment guide

## 💡 Pro Tips

- **Auto-reload**: Both frontend and backend automatically reload on code changes
- **Browser DevTools**: Use F12 to inspect network requests and console logs  
- **Multiple Terminals**: Keep both backend and frontend terminals visible
- **API Testing**: Use browser or Postman to test API endpoints directly

---

**🎉 Success!** You now have a fully functional e-commerce web application running locally. The app demonstrates modern full-stack development patterns and is ready for Azure deployment.