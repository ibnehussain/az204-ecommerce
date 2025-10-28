# Azure Developer Course - Quick Start Guide

## 🎯 Course Structure Overview

This progressive course teaches Azure development through building a real e-commerce application. Each module adds new Azure services while maintaining a working, deployable application.

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Azure Subscription** ([Free account available](https://azure.microsoft.com/free/))
- [ ] **Azure CLI** installed and logged in (`az --version`)
- [ ] **Node.js 18+** installed (`node --version`)
- [ ] **Git** installed and configured
- [ ] **Visual Studio Code** with recommended extensions
- [ ] **GitHub account** (for repository and CI/CD)

## 🚀 Quick Setup

### 1. Clone and Initialize
```bash
# Clone the repository
git clone <your-repo-url>
cd az204

# Install dependencies
cd src/backend && npm install
cd ../frontend && npm install
cd ../..
```

### 2. Set Up Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your settings (start with NODE_ENV=development)
code .env
```

### 3. Run Locally
```bash
# Terminal 1 - Backend API
cd src/backend
npm run dev

# Terminal 2 - Frontend App  
cd src/frontend
npm start
```

Visit: http://localhost:3000

## 📚 Module Learning Path

### 🟢 Beginner (Modules 1-4)
**Goal**: Learn basic Azure web application deployment and storage

| Module | Service | What You'll Learn | Time Est. |
|--------|---------|-------------------|-----------|
| **01** | App Service | Deploy web apps to Azure, configure CI/CD | 2-3 hours |
| **02** | Functions | Serverless computing, event-driven architecture | 2-3 hours |
| **03** | Blob Storage | File storage, CDN, image handling | 2-3 hours |
| **04** | Cosmos DB | NoSQL databases, global distribution | 3-4 hours |

### 🟡 Intermediate (Modules 5-7)  
**Goal**: Add security, configuration management

| Module | Service | What You'll Learn | Time Est. |
|--------|---------|-------------------|-----------|
| **05** | Identity (MSAL) | Authentication, OAuth 2.0, JWT tokens | 3-4 hours |
| **06** | Key Vault | Secret management, certificates | 2-3 hours |
| **07** | App Configuration | Feature flags, centralized settings | 2-3 hours |

### 🔴 Advanced (Modules 8-11)
**Goal**: Enterprise patterns, monitoring, messaging

| Module | Service | What You'll Learn | Time Est. |
|--------|---------|-------------------|-----------|
| **08** | API Management | API gateway, rate limiting, security | 3-4 hours |
| **09** | Event Grid/Hub | Event-driven messaging, real-time processing | 4-5 hours |
| **10** | Service Bus/Queues | Reliable messaging, async processing | 3-4 hours |
| **11** | App Insights | Monitoring, logging, performance tracking | 2-3 hours |

## 🛠️ Module Workflow

### Starting a Module
```bash
# 1. Switch to module branch
git checkout 01-app-service

# 2. Read the module README
cat README.md

# 3. Deploy infrastructure
az deployment group create \
  --resource-group rg-ecommerce-dev \
  --template-file infrastructure/bicep/main.bicep

# 4. Update environment variables
# Edit .env with new Azure resource details

# 5. Test locally
npm run dev (backend)
npm start (frontend)

# 6. Deploy to Azure
git push origin 01-app-service
```

### Module Structure
Each branch contains:
```
├── README.md              # Module-specific instructions
├── src/
│   ├── backend/          # Updated backend code
│   └── frontend/         # Updated frontend code  
├── infrastructure/
│   └── bicep/           # Azure resources for this module
├── .github/workflows/   # CI/CD pipeline
└── docs/               # Module documentation
```

## 🎓 Learning Objectives

By completing this course, you will:

### **Technical Skills**
- Deploy and manage Azure web applications
- Implement serverless architectures with Azure Functions
- Design secure applications with managed identities
- Build event-driven systems with messaging services
- Monitor applications with Azure Application Insights
- Manage infrastructure as code with Bicep

### **Azure Services Mastery**
- **Compute**: App Service, Azure Functions
- **Storage**: Blob Storage, Cosmos DB
- **Security**: Key Vault, Managed Identity, Azure AD
- **Integration**: Event Grid, Service Bus, API Management
- **Monitoring**: Application Insights, Log Analytics
- **Configuration**: App Configuration, Feature Flags

### **DevOps Practices**
- CI/CD with GitHub Actions
- Infrastructure as Code (Bicep)
- Environment management
- Automated testing and deployment

## 🗂️ Resource Organization

### Azure Resources Naming
```
Resource Group: rg-ecomm-dev
App Service: app-ecomm-dev-{unique}
Storage Account: stecommdev{unique}
Cosmos DB: cosmos-ecomm-dev-{unique}
Key Vault: kv-ecomm-dev-{unique}
```

### Cost Management
- **Free Tier Usage**: Most services have free tiers suitable for learning
- **Resource Cleanup**: Each module includes cleanup instructions
- **Cost Monitoring**: Set up budget alerts in Azure

## 🧪 Testing Strategy

### Local Testing
```bash
# Backend tests
cd src/backend && npm test

# Frontend tests  
cd src/frontend && npm test

# Integration tests
npm run test:integration
```

### Azure Testing
- **Health Checks**: `/api/health` endpoint monitoring
- **End-to-End**: Automated browser testing with Playwright
- **Load Testing**: Azure Load Testing (Module 11)

## 🔧 Troubleshooting

### Common Issues

**1. Azure CLI Not Authenticated**
```bash
az login
az account show
az account set --subscription "Your Subscription Name"
```

**2. Node Version Mismatch**
```bash
nvm use 18  # or install Node.js 18+
npm install
```

**3. Port Conflicts**
```bash
# Change ports in .env
PORT=3002 (backend)
# Frontend will automatically use 3001
```

**4. Azure Resource Conflicts**
```bash
# Resources names must be globally unique
# Update resourcePrefix in bicep parameters
```

### Getting Help

- **GitHub Issues**: Report bugs and ask questions
- **Documentation**: Check module-specific README files  
- **Azure Docs**: [docs.microsoft.com/azure](https://docs.microsoft.com/azure)
- **Community**: Stack Overflow with `azure` tag

## 📈 Progress Tracking

### Completion Checklist
Track your progress through the course:

**Foundation**
- [ ] Local development environment setup
- [ ] Successfully run application locally
- [ ] Azure CLI configured and working

**Module Completion** (Check when deployed and tested)
- [ ] 01 - App Service: Web app deployed to Azure
- [ ] 02 - Functions: Serverless functions working  
- [ ] 03 - Blob Storage: File upload/download working
- [ ] 04 - Cosmos DB: Data persisted in cloud database
- [ ] 05 - Identity: User authentication implemented
- [ ] 06 - Key Vault: Secrets secured in Key Vault
- [ ] 07 - App Config: Feature flags operational
- [ ] 08 - API Management: APIs secured and managed
- [ ] 09 - Event Grid/Hub: Event processing working
- [ ] 10 - Service Bus: Async messaging implemented
- [ ] 11 - App Insights: Monitoring and alerts active

### Certification Path
This course prepares you for:
- **AZ-204**: Developing Solutions for Microsoft Azure
- **AZ-400**: Designing and Implementing Microsoft DevOps Solutions

## 🎉 Next Steps

After completing the course:

1. **Build Your Own Project**: Apply learned concepts to your own application
2. **Explore Advanced Topics**: Kubernetes, Container Apps, Logic Apps
3. **Get Certified**: Take the AZ-204 certification exam
4. **Join Community**: Participate in Azure community events and forums

---

**Ready to start?** Choose your module and begin building! 🚀