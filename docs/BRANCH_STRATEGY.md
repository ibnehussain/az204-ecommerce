# Branch Creation Strategy & Commit Guidelines

## 📋 Overview

This document outlines the branch creation strategy and commit message conventions for the Azure E-commerce Demo course repository.

## 🌿 Branch Structure

### Main Branch
- **`main`** - Contains the base application structure and documentation
- Always deployable base version
- No Azure services integrated (just the foundation)

### Module Branches
Each module has its own branch with incremental Azure services:

```
main
├── 01-app-service
├── 02-functions
├── 03-blob-storage
├── 04-cosmos-db
├── 05-identity-msal
├── 06-key-vault
├── 07-app-configuration
├── 08-api-management
├── 09-event-grid-event-hub
├── 10-service-bus-storage-queue
└── 11-app-insights
```

## 🚀 Branch Creation Commands

### Initial Setup

1. **Create and push the main branch:**
```bash
git add .
git commit -m "feat: initialize base e-commerce application structure

- Add React frontend with shopping cart functionality
- Add Node.js/Express backend with REST API
- Add Bicep infrastructure templates
- Add GitHub Actions CI/CD workflow
- Add comprehensive documentation and setup guides

This provides the foundation for progressive Azure services integration."

git branch -M main
git push -u origin main
```

2. **Create module branches:**

```bash
# Module 01 - App Service
git checkout -b 01-app-service
git push -u origin 01-app-service

# Module 02 - Azure Functions  
git checkout -b 02-functions
git push -u origin 02-functions

# Module 03 - Blob Storage
git checkout -b 03-blob-storage  
git push -u origin 03-blob-storage

# Module 04 - Cosmos DB
git checkout -b 04-cosmos-db
git push -u origin 04-cosmos-db

# Module 05 - Identity & MSAL
git checkout -b 05-identity-msal
git push -u origin 05-identity-msal

# Module 06 - Key Vault
git checkout -b 06-key-vault
git push -u origin 06-key-vault

# Module 07 - App Configuration  
git checkout -b 07-app-configuration
git push -u origin 07-app-configuration

# Module 08 - API Management
git checkout -b 08-api-management
git push -u origin 08-api-management

# Module 09 - Event Grid & Event Hub
git checkout -b 09-event-grid-event-hub
git push -u origin 09-event-grid-event-hub

# Module 10 - Service Bus & Storage Queue
git checkout -b 10-service-bus-storage-queue
git push -u origin 10-service-bus-storage-queue

# Module 11 - Application Insights
git checkout -b 11-app-insights
git push -u origin 11-app-insights
```

## 📝 Commit Message Convention

We follow the **Conventional Commits** specification for consistent commit messages.

### Format
```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types
- **feat**: New feature or Azure service integration
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code formatting (no functional changes)
- **refactor**: Code refactoring (no functional changes)
- **test**: Adding or modifying tests
- **chore**: Maintenance tasks, dependency updates
- **ci**: CI/CD pipeline changes
- **perf**: Performance improvements
- **security**: Security-related changes

### Scopes (Optional)
- **frontend**: React application changes
- **backend**: Node.js/Express API changes
- **infra**: Infrastructure (Bicep templates)
- **ci**: CI/CD workflow changes
- **docs**: Documentation updates
- **config**: Configuration changes

### Examples

#### Module Implementation Commits
```bash
# Adding a new Azure service
git commit -m "feat(infra): add Azure Functions infrastructure

- Add Function App resource in Bicep template
- Configure consumption plan and storage account
- Add application settings for function integration
- Update deployment pipeline for functions

Implements serverless background processing for order handling."

# Frontend integration
git commit -m "feat(frontend): integrate Azure Blob Storage for image upload

- Add image upload component for product management
- Implement Azure Storage SDK integration
- Add progress indicators and error handling
- Update product form with image upload capability

Products can now have uploaded images stored in Azure Blob Storage."

# Backend API changes
git commit -m "feat(backend): implement Cosmos DB integration

- Replace in-memory data store with Cosmos DB
- Add Cosmos DB SDK and connection logic
- Implement CRUD operations for products and orders
- Add error handling and retry policies

Data is now persisted in Azure Cosmos DB with automatic scaling."
```

#### Bug Fixes
```bash
git commit -m "fix(frontend): resolve cart state persistence issue

Cart items were not persisting across page refreshes.
Updated localStorage implementation in CartContext."

git commit -m "fix(infra): correct App Service Plan SKU configuration

Changed from F1 to B1 to support Always On feature required for production workloads."
```

#### Documentation Updates
```bash
git commit -m "docs: add deployment guide for module 03

- Add step-by-step Blob Storage setup instructions  
- Include Azure CLI commands for resource creation
- Add troubleshooting section for common issues"
```

#### Configuration Changes
```bash
git commit -m "chore(config): update environment variables for Key Vault integration

- Add Key Vault URL and authentication settings
- Update .env.example with new required variables
- Add validation for missing configuration"
```

## 🏷️ Tagging Strategy

### Release Tags
Tag each completed module for easy reference:

```bash
# After completing a module
git tag -a v1.1.0-app-service -m "Module 1: Azure App Service integration complete"
git tag -a v1.2.0-functions -m "Module 2: Azure Functions integration complete"
git tag -a v1.3.0-blob-storage -m "Module 3: Azure Blob Storage integration complete"

# Push tags
git push origin --tags
```

## 🔄 Workflow for Module Development

### 1. Start New Module
```bash
# Switch to the module branch
git checkout 02-functions

# Make sure you have the latest changes
git pull origin 02-functions
```

### 2. Development Process
```bash
# Make your changes
# Test locally
# Commit frequently with descriptive messages

git add .
git commit -m "feat(infra): add Azure Functions infrastructure template"

git add .  
git commit -m "feat(backend): implement order processing function"

git add .
git commit -m "feat(frontend): add order status tracking UI"
```

### 3. Module Completion
```bash
# Final commit for the module
git commit -m "feat: complete Azure Functions integration

- Add serverless order processing workflow
- Implement event-driven architecture  
- Add monitoring and error handling
- Update documentation with deployment steps

Module 02 (Azure Functions) is now complete and ready for deployment."

# Tag the release
git tag -a v1.2.0-functions -m "Module 2: Azure Functions integration complete"

# Push everything
git push origin 02-functions --tags
```

## 📊 Branch Protection Rules

### Main Branch
- Require pull request reviews
- Require status checks (CI/CD pipeline)
- Require up-to-date branches before merging
- Restrict pushes to main branch

### Module Branches  
- Allow direct pushes for course development
- Require CI pipeline success before deployment
- Automatically deploy to dev environment on push

## 🎯 Best Practices

1. **Keep commits atomic** - One logical change per commit
2. **Write descriptive commit messages** - Explain what and why
3. **Test before committing** - Ensure code works locally
4. **Use meaningful branch names** - Follow the module naming convention
5. **Document changes** - Update README files when adding new features
6. **Tag releases** - Tag completed modules for easy reference

## 📚 Additional Resources

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Git Best Practices](https://git-scm.com/book/en/v2/Distributed-Git-Contributing-to-a-Project)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

---

This strategy ensures consistent development practices and makes it easy for students to follow the course progression.