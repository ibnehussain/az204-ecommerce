# Azure Service Branch Template
## Quick-Start Template for New Service Implementations

This template provides a standardized starting point for creating new Azure service demonstration branches.

---

## 🚀 **Branch Creation Commands**

```bash
# Replace [SERVICE-NAME] with actual service (e.g., blob-storage, cosmos-db)
export SERVICE_NAME="[SERVICE-NAME]"
export BRANCH_NAME="[##-SERVICE-NAME]"  # e.g., 03-blob-storage

# Create new branch from main
git checkout main
git pull origin main
git checkout -b $BRANCH_NAME

# Copy template structure from 02-functions
cp -r .github .
cp -r .vscode .
cp -r docs .
cp -r scripts .
mkdir -p infrastructure
mkdir -p src/$SERVICE_NAME

# Initialize with template files
```

---

## 📁 **Universal Directory Structure Template**

```
[branch-name]/
├── README.md                           # 📋 Main service documentation
├── .github/workflows/
│   └── deploy-[service].yml            # 🔄 CI/CD pipeline
├── .vscode/
│   ├── settings.json                   # ⚙️ VS Code settings
│   ├── tasks.json                      # 🔧 Build and deployment tasks
│   ├── launch.json                     # 🚀 Debug configurations
│   └── extensions.json                 # 📦 Recommended extensions
├── infrastructure/
│   ├── [service].bicep                 # 🏗️ Main infrastructure template
│   ├── [service].parameters.json       # ⚙️ Configuration parameters
│   └── modules/                        # 📦 Reusable Bicep modules
├── scripts/
│   ├── deploy.ps1                      # 🚀 PowerShell deployment
│   ├── cleanup.ps1                     # 🧹 Resource cleanup
│   ├── test.ps1                        # 🧪 Testing automation
│   └── local-setup.ps1                 # 💻 Local development setup
├── src/
│   └── [service-specific]/             # 💻 Service implementation
├── docs/
│   ├── GETTING_STARTED.md              # 🎯 Quick start guide
│   ├── ARCHITECTURE.md                 # 🏗️ Architecture overview
│   ├── TROUBLESHOOTING.md              # 🔧 Common issues
│   └── LEARNING_PATH.md                # 📚 Educational progression
└── tests/                              # 🧪 Automated tests
    ├── integration/                    # 🔗 Integration tests
    └── unit/                          # ⚡ Unit tests
```

---

## 📋 **README.md Template**

```markdown
# Azure [SERVICE-NAME] Demo - [Service Description]

A **standalone** Azure [SERVICE-NAME] demonstration showing [key concepts].

## 🎯 What This Demo Shows

- ✅ **[Key Feature 1]** - [description]
- ✅ **[Key Feature 2]** - [description]
- ✅ **[Key Feature 3]** - [description]
- ✅ **Infrastructure as Code** - Bicep template for deployment
- ✅ **CI/CD Pipeline** - GitHub Actions for automated deployment

## 🏗️ Architecture

```
[ASCII architecture diagram]
```

## ⚡ Quick Start

### Prerequisites
- [List prerequisites]

### Local Development
1. **Clone and navigate**:
   ```bash
   git clone <repository-url>
   cd az204/src/[service-name]
   ```

2. **Setup dependencies**:
   ```bash
   [setup commands]
   ```

3. **Run locally**:
   ```bash
   [run commands]
   ```

## 🚀 Deployment Options

### Option 1: Manual Deployment
[Azure CLI commands]

### Option 2: Infrastructure as Code
[Bicep deployment commands]

### Option 3: PowerShell Automation
[PowerShell script usage]

### Option 4: GitHub Actions CI/CD
[CI/CD setup instructions]

## 🧪 Testing Your Service
[Testing instructions and examples]

## 📊 Monitoring & Logs
[Monitoring setup and usage]

## 🎓 Learning Objectives
[What users will learn]

## 💰 Cost Considerations
[Cost breakdown and optimization tips]

## 🧹 Cleanup
[Cleanup instructions]

## 🔗 Additional Resources
[Links to documentation and learning materials]

---

*This is a standalone demo focused solely on Azure [SERVICE-NAME]. No external dependencies required.*
```

---

## 🏗️ **Bicep Template Structure**

### **Main Template: `infrastructure/[service].bicep`**

```bicep
@description('Name of the [Service]')
param serviceName string = '[service]-demo-${uniqueString(resourceGroup().id)}'

@description('Location for all resources')
param location string = resourceGroup().location

@description('Environment type')
@allowed([
  'dev'
  'test'
  'prod'
])
param environmentType string = 'dev'

// Variables
var resourcePrefix = '${serviceName}-${environmentType}'
var tags = {
  Environment: environmentType
  Project: 'AZ204-Demo'
  Service: '[SERVICE-NAME]'
  ManagedBy: 'Bicep'
}

// Main service resource
resource mainService 'Microsoft.[Provider]/[ResourceType]@[API-Version]' = {
  name: '${resourcePrefix}-main'
  location: location
  tags: tags
  properties: {
    // Service-specific properties
  }
}

// Application Insights (standard across all demos)
resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: '${resourcePrefix}-ai'
  location: location
  tags: tags
  kind: 'web'
  properties: {
    Application_Type: 'web'
    Request_Source: 'rest'
  }
}

// Outputs
output serviceName string = mainService.name
output serviceId string = mainService.id
output serviceEndpoint string = mainService.properties.endpoint
output applicationInsightsName string = applicationInsights.name
output resourceGroupName string = resourceGroup().name
```

### **Parameters File: `infrastructure/[service].parameters.json`**

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "serviceName": {
      "value": "az204-[service]-demo"
    },
    "location": {
      "value": "East US"
    },
    "environmentType": {
      "value": "dev"
    }
  }
}
```

---

## 🔄 **GitHub Actions Template**

### **`.github/workflows/deploy-[service].yml`**

```yaml
name: Deploy Azure [SERVICE-NAME] Demo

on:
  push:
    branches: [ main, [##-service-name] ]
  workflow_dispatch:

env:
  AZURE_RESOURCE_GROUP: 'rg-az204-[service]-demo'
  AZURE_LOCATION: 'East US'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: 'Checkout GitHub Action'
      uses: actions/checkout@v4

    - name: 'Setup Node.js' # If needed
      uses: actions/setup-node@v4
      with:
        node-version: '18'

    - name: 'Install Dependencies' # If needed
      run: |
        cd src/[service-name]
        npm install

    - name: 'Login to Azure'
      uses: azure/login@v1
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}

    - name: 'Deploy Infrastructure'
      uses: azure/arm-deploy@v1
      with:
        subscriptionId: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
        resourceGroupName: ${{ env.AZURE_RESOURCE_GROUP }}
        template: ./infrastructure/[service].bicep
        parameters: ./infrastructure/[service].parameters.json
        failOnStdErr: false

    - name: 'Deploy Application' # If needed
      run: |
        # Service-specific deployment commands
        echo "Deploy application code here"
```

---

## 🖥️ **PowerShell Script Templates**

### **`scripts/deploy.ps1`**

```powershell
# Azure [SERVICE-NAME] Deployment Script
param(
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroupName,
    
    [Parameter(Mandatory=$true)]
    [string]$ServiceName,
    
    [Parameter(Mandatory=$false)]
    [string]$Location = "East US"
)

Write-Host "🚀 Starting Azure [SERVICE-NAME] Demo Deployment..." -ForegroundColor Green

# Check Azure login
$context = Get-AzContext
if (-not $context) {
    Write-Host "❌ Not logged into Azure. Please run 'Connect-AzAccount' first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Azure context found: $($context.Account.Id)" -ForegroundColor Green

# Create resource group if needed
Write-Host "📦 Checking resource group: $ResourceGroupName" -ForegroundColor Yellow
$rg = Get-AzResourceGroup -Name $ResourceGroupName -ErrorAction SilentlyContinue
if (-not $rg) {
    Write-Host "Creating resource group: $ResourceGroupName in $Location" -ForegroundColor Yellow
    $rg = New-AzResourceGroup -Name $ResourceGroupName -Location $Location
    Write-Host "✅ Resource group created" -ForegroundColor Green
}

# Deploy infrastructure
Write-Host "🏗️ Deploying infrastructure..." -ForegroundColor Yellow
$deploymentName = "[service]-demo-$(Get-Date -Format 'yyyyMMdd-HHmmss')"

try {
    $deployment = New-AzResourceGroupDeployment `
        -ResourceGroupName $ResourceGroupName `
        -Name $deploymentName `
        -TemplateFile "./infrastructure/[service].bicep" `
        -serviceName $ServiceName `
        -location $Location `
        -Verbose

    if ($deployment.ProvisioningState -eq "Succeeded") {
        Write-Host "✅ Infrastructure deployed successfully" -ForegroundColor Green
        
        # Output key information
        Write-Host "📋 Deployment Summary:" -ForegroundColor Cyan
        Write-Host "  Service Name: $($deployment.Outputs.serviceName.Value)" -ForegroundColor White
        Write-Host "  Service Endpoint: $($deployment.Outputs.serviceEndpoint.Value)" -ForegroundColor White
        Write-Host "  Resource Group: $($deployment.Outputs.resourceGroupName.Value)" -ForegroundColor White
        
        Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
        
    } else {
        Write-Host "❌ Infrastructure deployment failed" -ForegroundColor Red
        exit 1
    }
    
} catch {
    Write-Host "❌ Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
```

### **`scripts/cleanup.ps1`**

```powershell
# Azure [SERVICE-NAME] Demo Cleanup Script
param(
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroupName,
    
    [Parameter(Mandatory=$false)]
    [switch]$Force
)

Write-Host "🧹 Azure [SERVICE-NAME] Demo Cleanup" -ForegroundColor Yellow

# Check Azure login
$context = Get-AzContext
if (-not $context) {
    Write-Host "❌ Not logged into Azure. Please run 'Connect-AzAccount' first." -ForegroundColor Red
    exit 1
}

# Check if resource group exists
$rg = Get-AzResourceGroup -Name $ResourceGroupName -ErrorAction SilentlyContinue
if (-not $rg) {
    Write-Host "ℹ️ Resource group '$ResourceGroupName' does not exist." -ForegroundColor Yellow
    exit 0
}

# List resources
Write-Host "📋 Resources in '$ResourceGroupName':" -ForegroundColor Cyan
$resources = Get-AzResource -ResourceGroupName $ResourceGroupName
$resources | Format-Table Name, ResourceType, Location -AutoSize

# Confirmation
if (-not $Force) {
    Write-Host "`n⚠️ This will permanently delete ALL resources in the resource group!" -ForegroundColor Red
    $confirm = Read-Host "Are you sure you want to continue? Type 'DELETE' to confirm"
    
    if ($confirm -ne 'DELETE') {
        Write-Host "❌ Cleanup cancelled." -ForegroundColor Yellow
        exit 0
    }
}

# Delete resources
Write-Host "🚨 Deleting resource group and all resources..." -ForegroundColor Red
try {
    Remove-AzResourceGroup -Name $ResourceGroupName -Force -AsJob | Out-Null
    Write-Host "✅ Deletion initiated. This may take several minutes to complete." -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to delete resource group: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
```

---

## 🧪 **VS Code Configuration Templates**

### **`.vscode/settings.json`**

```json
{
    "files.exclude": {
        "**/node_modules": true,
        "**/bin": true,
        "**/obj": true
    },
    "bicep.enabled": true,
    "azureFunctions.showProjectWarning": false,
    "editor.tabSize": 2,
    "editor.insertSpaces": true,
    "editor.detectIndentation": false,
    "powershell.codeFormatting.preset": "OTBS",
    "json.schemas": [
        {
            "fileMatch": ["*.parameters.json"],
            "url": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json"
        }
    ]
}
```

### **`.vscode/tasks.json`**

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Deploy Infrastructure",
            "type": "shell",
            "command": "az",
            "args": [
                "deployment", "group", "create",
                "--resource-group", "${input:resourceGroup}",
                "--template-file", "infrastructure/[service].bicep",
                "--parameters", "infrastructure/[service].parameters.json"
            ],
            "group": "build",
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": false,
                "panel": "shared"
            },
            "problemMatcher": []
        },
        {
            "label": "Cleanup Resources",
            "type": "shell",
            "command": "powershell",
            "args": [
                "-File", "scripts/cleanup.ps1",
                "-ResourceGroupName", "${input:resourceGroup}",
                "-Force"
            ],
            "group": "build",
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": false,
                "panel": "shared"
            },
            "problemMatcher": []
        }
    ],
    "inputs": [
        {
            "id": "resourceGroup",
            "description": "Resource Group Name",
            "default": "rg-az204-[service]-demo",
            "type": "promptString"
        }
    ]
}
```

### **`.vscode/extensions.json`**

```json
{
    "recommendations": [
        "ms-azuretools.vscode-bicep",
        "ms-azuretools.vscode-azureresourcegroups",
        "ms-vscode.powershell",
        "ms-vscode.vscode-json",
        "streetsidesoftware.code-spell-checker"
    ]
}
```

---

## 📚 **Documentation Templates**

### **`docs/GETTING_STARTED.md`**

```markdown
# Getting Started with Azure [SERVICE-NAME]

This guide walks you through deploying and testing the Azure [SERVICE-NAME] demo.

## 🎯 Prerequisites

- Azure subscription with appropriate permissions
- [List specific prerequisites]

## 🚀 Quick Deployment (15 minutes)

### Step 1: Clone Repository
[Commands]

### Step 2: Deploy Infrastructure
[Commands]

### Step 3: Test Service
[Commands]

### Step 4: Explore Features
[Exploration guide]

## 🔧 Troubleshooting

### Common Issues
[List common problems and solutions]

## 📚 Next Steps
[Suggestions for further learning]
```

### **`docs/TROUBLESHOOTING.md`**

```markdown
# Troubleshooting Azure [SERVICE-NAME] Demo

Common issues and their solutions.

## 🚨 Deployment Issues

### Issue: [Common Problem]
**Symptoms**: [Description]
**Cause**: [Root cause]
**Solution**: [Step-by-step fix]

## 🔧 Runtime Issues

### Issue: [Runtime Problem]
**Symptoms**: [Description]
**Cause**: [Root cause]
**Solution**: [Step-by-step fix]

## 💰 Cost Issues

### Issue: [Cost Problem]
**Symptoms**: [Description]
**Cause**: [Root cause]
**Solution**: [Step-by-step fix]

## 📞 Getting Help

- [Documentation links]
- [Community resources]
- [Support channels]
```

---

## 🎯 **Implementation Checklist**

Use this checklist when creating a new service branch:

- [ ] **Branch created** from main with proper naming
- [ ] **Directory structure** follows template
- [ ] **README.md** customized for service
- [ ] **Bicep template** implements service resources
- [ ] **PowerShell scripts** work end-to-end
- [ ] **GitHub Actions** deploys successfully
- [ ] **VS Code configuration** supports development
- [ ] **Documentation** complete and accurate
- [ ] **Testing** validates all functionality
- [ ] **Cost optimization** implemented
- [ ] **Security** best practices followed
- [ ] **Cleanup** removes all resources

---

*This template ensures consistent, high-quality implementations across all Azure service demonstration branches.*