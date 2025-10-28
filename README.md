# Azure Developer Course - E-Commerce Demo

This repository contains a progressive e-commerce application that demonstrates integrating various Azure services step by step. Each branch represents a working version of the application with new Azure services added incrementally.

## 🎯 Course Overview

This hands-on course teaches Azure development through a real-world e-commerce application. Starting with a simple web app, we progressively add Azure services to build a complete, production-ready solution.

## 📚 Course Modules (Branches)

| Branch | Module | Azure Services | Description |
|--------|--------|----------------|-------------|
| `01-app-service` | Web App Basics | App Service | Simple React + Node.js web app |
| `02-functions` | Serverless Computing | Azure Functions | Add serverless background processing |
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
│   └── backend/           # Node.js Express backend
├── infrastructure/
│   └── bicep/            # Azure infrastructure as code
├── .github/
│   └── workflows/        # CI/CD pipelines
├── docs/                 # Additional documentation
├── .env.example         # Environment variables template
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
2. `02-functions` - Serverless computing
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

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues** - Report bugs and request features via GitHub Issues
- **Discussions** - Ask questions in GitHub Discussions
- **Documentation** - Check the `docs/` folder for additional guides

---

**Happy Learning! 🚀**

*This course is designed to give you practical, hands-on experience with Azure services through a realistic application scenario.*