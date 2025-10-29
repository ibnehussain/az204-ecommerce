# Azure Developer Course - E-Commerce Demo

This repository contains a progressive e-commerce application that demonstrates integrating various Azure services step by step. Each branch represents a working version of the application with new Azure services added incrementally.

> Quick update: branch `02-functions` — local edit on 2025-10-29 to add documentation and CI/CD workflow updates.

## 🎯 Course Overview

This hands-on course teaches Azure development through a real-world e-commerce application. Starting with a simple web app, we progressively add Azure services to build a complete, production-ready solution.

---

## 📦 **Module 02: Azure Functions Integration** 

> **Current Branch: `02-functions`** - Serverless order processing with Azure Functions

### What's New in This Module

This module introduces **serverless computing** to our e-commerce application by adding **Azure Functions** for order processing. Instead of handling all business logic in the web app, we now use serverless functions to process orders asynchronously and independently.

#### 🔥 **Key Features Added**
- **OrderProcessor Azure Function**: HTTP-triggered serverless function for order validation and processing
- **Backend Integration**: Express.js routes that communicate with Azure Functions via HTTP
- **Parallel CI/CD**: Independent deployment of App Service and Azure Functions
- **Service-to-Service Communication**: Demonstrates microservices patterns with serverless architecture

#### 🏗️ **Updated Architecture**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   React Frontend │────│ Node.js Backend  │────│  Azure Functions    │
│   (Static Site)  │    │  (App Service)   │    │  (OrderProcessor)   │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
         │                        │                        │
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   Azure Blob    │    │ Application      │    │    Monitoring &     │
│    Storage      │    │    Insights      │    │     Logging        │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
```

**Request Flow:**
1. User submits order via React frontend
2. Backend receives request at `/api/orders`
3. Backend forwards request to Azure Function via HTTP
4. Function validates order and generates order ID
5. Function returns confirmation to backend
6. Backend returns response to frontend

### 🔧 **Azure Function Implementation**

#### OrderProcessor Function (`src/functions/OrderProcessor/`)
```javascript
// HTTP-triggered Azure Function for order processing
module.exports = async function (context, req) {
    context.log('OrderProcessor function triggered');
    
    try {
        // Validate request body
        if (!req.body || !req.body.productId || !req.body.quantity) {
            context.res = {
                status: 400,
                body: { error: "Missing required fields: productId, quantity" }
            };
            return;
        }

        // Process order (simplified business logic)
        const order = {
            orderId: generateOrderId(),
            productId: req.body.productId,
            quantity: parseInt(req.body.quantity),
            timestamp: new Date().toISOString(),
            status: 'processed'
        };

        context.log(`Order processed: ${order.orderId}`);
        
        context.res = {
            status: 200,
            headers: { "Content-Type": "application/json" },
            body: order
        };
    } catch (error) {
        context.log.error('Error processing order:', error);
        context.res = {
            status: 500,
            body: { error: "Internal server error" }
        };
    }
};
```

#### Function Configuration (`function.json`)
```json
{
  "bindings": [
    {
      "authLevel": "function",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post"],
      "route": "orders"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

### 🔗 **Backend Integration**

The Express.js backend now includes a new route that integrates with the Azure Function:

#### Orders Route (`src/backend/routes/orders.js`)
```javascript
const express = require('express');
const axios = require('axios');
const router = express.Router();

// POST /api/orders - Process order via Azure Function
router.post('/', async (req, res) => {
    const requestId = generateRequestId();
    
    try {
        console.log(`[${requestId}] Processing order request:`, req.body);
        
        // Call Azure Function
        const functionResponse = await axios.post(
            `${process.env.FUNCTION_URL}/api/orders`,
            req.body,
            { 
                headers: { 'Content-Type': 'application/json' },
                timeout: 10000 
            }
        );
        
        console.log(`[${requestId}] Function response:`, functionResponse.status);
        res.json(functionResponse.data);
        
    } catch (error) {
        console.error(`[${requestId}] Order processing failed:`, error.message);
        res.status(500).json({ 
            error: 'Order processing failed',
            requestId 
        });
    }
});

module.exports = router;
```

### 🚀 **Deployment & CI/CD**

#### GitHub Actions Workflow (`.github/workflows/deploy.yml`)

The deployment pipeline now includes parallel deployment of both App Service and Azure Functions:

```yaml
jobs:
  test:
    # Validates both backend and functions code
    
  deploy-infrastructure:
    # Provisions Azure resources (App Service + Function App)
    
  deploy-backend:
    # Deploys Express.js app to App Service
    needs: deploy-infrastructure
    
  deploy-functions:
    # Deploys Azure Functions independently
    needs: deploy-infrastructure
    steps:
      - name: Deploy Azure Functions
        uses: Azure/functions-action@v1
        with:
          app-name: ${{ needs.deploy-infrastructure.outputs.functionAppName }}
          package: src/functions
          publish-profile: ${{ secrets.AZURE_FUNCTIONAPP_PUBLISH_PROFILE }}
          
  health-check:
    # Tests both services after deployment
    needs: [deploy-backend, deploy-functions]
```

### 🧪 **Testing the Implementation**

#### 1. **Local Development**
```bash
# Start Azure Functions locally
cd src/functions
npm start
# Functions available at: http://localhost:7071

# Test the function directly
curl -X POST http://localhost:7071/api/orders \
  -H "Content-Type: application/json" \
  -d '{"productId":"test-product","quantity":2}'
```

#### 2. **Test Backend Integration**
```bash
# Start backend server
cd src/backend
npm run dev
# Backend available at: http://localhost:3001

# Test via backend (calls function)
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{"productId":"integration-test","quantity":1}'
```

#### 3. **Expected Response**
```json
{
  "orderId": "ord_a1b2c3d4-e5f6-7890-abcd-1234567890ef",
  "productId": "test-product",
  "quantity": 2,
  "timestamp": "2025-10-29T10:30:00.000Z",
  "status": "processed"
}
```

### 📋 **Setup & Deployment Steps**

#### Prerequisites
- Azure subscription with Function App support
- GitHub repository with secrets configured
- Azure CLI installed locally

#### 1. **Environment Configuration**
```bash
# Copy and configure environment variables
cp .env.example .env

# Add Function App URL to .env
FUNCTION_URL=https://func-ecomm-dev.azurewebsites.net
```

#### 2. **GitHub Secrets Required**
```
AZURE_CREDENTIALS - Azure service principal for infrastructure deployment
AZURE_FUNCTIONAPP_PUBLISH_PROFILE - Function App publish profile from Azure Portal
```

#### 3. **Deploy via GitHub Actions**
```bash
# Push to main branch triggers deployment
git add .
git commit -m "Add Azure Functions integration"
git push origin 02-functions

# Or manually trigger deployment
# Go to GitHub Actions → Deploy E-commerce App with Functions → Run workflow
```

#### 4. **Verify Deployment**
```bash
# Test deployed function
curl -X POST https://func-ecomm-dev.azurewebsites.net/api/orders \
  -H "Content-Type: application/json" \
  -d '{"productId":"deployment-test","quantity":1}'

# Test backend integration
curl -X POST https://webapp-ecomm-dev.azurewebsites.net/api/orders \
  -H "Content-Type: application/json" \
  -d '{"productId":"backend-test","quantity":3}'
```

### 🎯 **What's Next: Module 03 - Blob Storage**

In the next module, we'll add **Azure Blob Storage** to handle:
- **Product Image Storage**: Upload and serve product images
- **Order Receipt Storage**: Store PDF receipts for completed orders
- **Document Management**: Handle user uploads and downloads
- **CDN Integration**: Serve static content globally via Azure CDN

**Coming Features:**
- Image upload functionality in the frontend
- Blob storage integration in Azure Functions
- Automated thumbnail generation
- Secure file access with SAS tokens

---

## 📚 Course Modules (Branches)

| Branch | Module | Azure Services | Description |
|--------|--------|----------------|-------------|
| `01-app-service` | Web App Basics | App Service | Simple React + Node.js web app |
| `02-functions` | **Serverless Computing** | **Azure Functions** | **HTTP-triggered functions for order processing** |
| `03-blob-storage` | File Storage | Blob Storage | Product image upload/retrieval |
| `04-cosmos-db` | NoSQL Database | Cosmos DB | Replace in-memory data with NoSQL |
| `05-identity-msal` | Authentication | Microsoft Identity | User authentication with MSAL |
| `06-key-vault` | Secret Management | Key Vault | Secure connection strings |
| `07-app-configuration` | Configuration | App Configuration | Feature flags and settings |
| `08-api-management` | API Gateway | API Management | Secure and manage APIs |
| `09-event-grid-event-hub` | Event Processing | Event Grid, Event Hub | Event-driven architecture |
| `10-service-bus-storage-queue` | Messaging | Service Bus, Storage Queue | Async communication |
| `11-app-insights` | Monitoring | Application Insights | Logging and performance monitoring |

## 🚀 Quick Start

### Prerequisites

- **Azure Subscription** - [Get a free account](https://azure.microsoft.com/free/)
- **Azure CLI** - [Install Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli)
- **Node.js 18+** - [Download Node.js](https://nodejs.org/)
- **Git** - [Install Git](https://git-scm.com/)
- **Visual Studio Code** - [Download VS Code](https://code.visualstudio.com/)

### Recommended VS Code Extensions

- Azure Account
- Azure App Service
- Azure Functions
- Azure Storage
- Bicep
- GitHub Copilot (optional but recommended)

### Getting Started

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd az204
   ```

2. **Choose your starting module**
   ```bash
   # Start with App Service module
   git checkout 01-app-service
   
   # Or jump to a specific module
   git checkout 05-identity-msal
   ```

3. **Follow the module's README**
   Each branch contains its own `README.md` with specific setup and deployment instructions.

## 📁 Repository Structure

```
├── src/
│   ├── frontend/          # React frontend application
│   ├── backend/           # Node.js Express backend
│   │   ├── routes/
│   │   │   └── orders.js  # 🆕 Azure Functions integration routes
│   │   └── server.js      # Updated with orders routes
│   └── functions/         # 🆕 Azure Functions
│       ├── OrderProcessor/
│       │   ├── index.js   # Function logic
│       │   └── function.json # Function bindings
│       ├── host.json      # Functions runtime config
│       ├── package.json   # Function dependencies
│       └── local.settings.json # Local dev settings
├── infrastructure/
│   └── bicep/            # Azure infrastructure as code
├── .github/
│   └── workflows/
│       └── deploy.yml    # 🆕 Updated with Functions deployment
├── docs/                 # Additional documentation
├── .env.example         # Environment variables template
├── IMPLEMENTATION-SUMMARY.md # 🆕 Module 02 summary
└── README.md           # This file
```

## 🛠️ Development Workflow

1. **Switch to desired branch**
   ```bash
   git checkout <branch-name>
   ```

2. **Install dependencies**
   ```bash
   cd src/backend && npm install
   cd ../frontend && npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Azure resource details
   ```

4. **Deploy infrastructure**
   ```bash
   az deployment group create \
     --resource-group rg-ecommerce-dev \
     --template-file infrastructure/bicep/main.bicep
   ```

5. **Run locally**
   ```bash
   # Terminal 1 - Backend
   cd src/backend && npm run dev
   
   # Terminal 2 - Frontend
   cd src/frontend && npm start
   ```

## 🌐 Application Features

The e-commerce demo includes:

- **Product Catalog** - Browse and search products
- **Shopping Cart** - Add/remove items, calculate totals
- **User Authentication** - Sign up, sign in, profile management
- **Order Processing** - Place orders, order history
- **Product Images** - Upload and display product photos
- **Admin Panel** - Manage products, view analytics
- **Real-time Updates** - Live notifications and updates

## 📖 Learning Path

### Beginner Track
Start with branches 1-4 to learn basic Azure web development:
1. `01-app-service` - Web app deployment
2. **`02-functions` - Serverless computing** ⭐ **(Current Module)**
3. `03-blob-storage` - File storage
4. `04-cosmos-db` - NoSQL database

### Intermediate Track
Continue with security and configuration (branches 5-7):
5. `05-identity-msal` - Authentication
6. `06-key-vault` - Secret management
7. `07-app-configuration` - Configuration management

### Advanced Track
Finish with enterprise patterns (branches 8-11):
8. `08-api-management` - API gateway
9. `09-event-grid-event-hub` - Event processing
10. `10-service-bus-storage-queue` - Messaging
11. `11-app-insights` - Monitoring

## 💡 Best Practices Demonstrated

- **Infrastructure as Code** - Bicep templates for all resources
- **Security** - Managed identities, Key Vault integration
- **Monitoring** - Application Insights, structured logging
- **CI/CD** - GitHub Actions for automated deployment
- **Configuration** - Environment-based settings
- **Error Handling** - Comprehensive error handling and retry policies
- **Performance** - Caching, CDN, and optimization techniques

## 🤝 Contributing

This is an educational repository. If you find issues or have suggestions:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request with clear description

## 📝 License

Copyright © 2025 Azhar. All rights reserved.

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues** - Report bugs and request features via GitHub Issues
- **Discussions** - Ask questions in GitHub Discussions
- **Documentation** - Check the `docs/` folder for additional guides

---

**Happy Learning! 🚀**

*This course is designed to give you practical, hands-on experience with Azure services through a realistic application scenario.*

© 2025 Azhar. All rights reserved.