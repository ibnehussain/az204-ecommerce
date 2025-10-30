# Azure Functions Demo - Serverless Order Processing

A **standalone** Azure Functions demonstration showing HTTP-triggered serverless functions for order processing.

## 🎯 What This Demo Shows

- ✅ **HTTP-triggered Azure Function** - responds to POST requests
- ✅ **JSON request/response** - processes structured order data
- ✅ **Error handling** - validates input and handles exceptions
- ✅ **Logging** - tracks function execution for debugging
- ✅ **Infrastructure as Code** - Bicep template for deployment
- ✅ **CI/CD Pipeline** - GitHub Actions for automated deployment

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────────┐
│   HTTP Client   │───▶│  Azure Functions    │
│  (Postman/curl) │    │  (OrderProcessor)   │
└─────────────────┘    └─────────────────────┘
         │                        │
         │                        ▼
         │              ┌─────────────────────┐
         │              │  Application Logs   │
         └──────────────│   & Monitoring      │
                        └─────────────────────┘
```

## ⚡ Quick Start

### Prerequisites
- [Node.js 18.x+](https://nodejs.org/)
- [Azure Functions Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local)
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) (for deployment)

### Local Development

1. **Clone and navigate**:
   ```bash
   git clone <repository-url>
   cd az204/src/functions
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local runtime**:
   ```bash
   func start
   ```

4. **Test the function**:
   ```bash
   # POST request to create an order
   curl -X POST http://localhost:7071/api/orders \
     -H "Content-Type: application/json" \
     -d '{
       "customerName": "John Doe",
       "items": [
         {"name": "Widget", "quantity": 2, "price": 10.99}
       ]
     }'
   ```

## 🚀 Deployment Options

### Option 1: Manual Deployment

```bash
# 1. Login to Azure
az login

# 2. Create resource group
az group create --name rg-functions-demo --location "East US"

# 3. Create Function App
az functionapp create \
  --resource-group rg-functions-demo \
  --consumption-plan-location eastus \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4 \
  --name func-demo-yourname \
  --storage-account stfuncdemo12345

# 4. Deploy function code
func azure functionapp publish func-demo-yourname
```

### Option 2: Infrastructure as Code

Deploy using Bicep template:
```bash
# 1. Create resource group
az group create \
  --name rg-functions-demo \
  --location "East US"

# 2. Deploy infrastructure
az deployment group create \
  --resource-group rg-functions-demo \
  --template-file infrastructure/function-app.bicep \
  --parameters appName=my-functions-demo

# 3. Deploy function code
func azure functionapp publish <function-app-name>
```

### Option 3: PowerShell Automation

Use the included PowerShell script for complete automation:
```powershell
# Deploy everything (infrastructure + code)
.\scripts\deploy.ps1 -ResourceGroupName "rg-functions-demo" -FunctionAppName "my-functions-demo"

# Clean up all resources when done
.\scripts\cleanup.ps1 -ResourceGroupName "rg-functions-demo"
```

### Option 4: GitHub Actions CI/CD

1. Fork this repository
2. Set up Azure service principal and add these secrets:
   - `AZURE_CREDENTIALS`
   - `AZURE_FUNCTIONAPP_NAME`
3. Push to `main` branch to trigger deployment

## 🧪 Testing Your Function

Once deployed, test your function:

```bash
# Replace with your function app URL
FUNCTION_URL="https://func-demo-123456.azurewebsites.net/api/orders"

# Test successful order creation
curl -X POST $FUNCTION_URL \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Jane Smith",
    "items": [
      {"name": "Laptop", "quantity": 1, "price": 999.99},
      {"name": "Mouse", "quantity": 1, "price": 25.50}
    ]
  }'

# Expected response:
# {
#   "orderId": "550e8400-e29b-41d4-a716-446655440000",
#   "customerName": "Jane Smith",
#   "items": [...],
#   "totalAmount": 1025.49,
#   "status": "pending",
#   "timestamp": "2024-01-15T10:30:00.000Z"
# }
```

## 📊 Monitoring & Logs

### View Logs in Azure Portal
1. Navigate to your Function App in Azure Portal
2. Go to **Functions** → **OrderProcessor** → **Monitor**
3. View execution logs and performance metrics

### Stream Logs Locally
```bash
# Stream live logs from Azure
func azure functionapp logstream <function-app-name>
```

### Application Insights
The function automatically sends telemetry to Application Insights:
- Request/response times
- Success/failure rates  
- Custom trace logs
- Exception details

## 🗂️ Project Structure

```
src/functions/
├── OrderProcessor/
│   ├── function.json      # Function configuration
│   └── index.js          # Function implementation
├── host.json             # Function app settings
├── package.json          # Dependencies
└── README.md            # Function-specific docs

infrastructure/
├── function-app.bicep           # Bicep template
└── function-app.parameters.json # Parameters

scripts/
├── deploy.ps1           # PowerShell deployment
└── cleanup.ps1          # Resource cleanup

.github/workflows/
└── deploy-functions.yml # CI/CD pipeline
```

## 🔧 Function Implementation Details

### Input Validation
The function validates:
- ✅ `customerName` is required and non-empty
- ✅ `items` array is required and non-empty
- ✅ Each item has `name`, `quantity`, and `price`
- ✅ Quantities are positive numbers
- ✅ Prices are positive numbers

### Error Responses
```javascript
// Missing required fields
{ "error": "Missing required field: customerName" }

// Invalid data types
{ "error": "Invalid item: quantity must be a positive number" }

// Server errors
{ "error": "Internal server error", "details": "..." }
```

### Success Response
```javascript
{
  "orderId": "uuid-v4-string",
  "customerName": "Customer Name",
  "items": [...],
  "totalAmount": 123.45,
  "status": "pending",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🎓 Learning Objectives

After completing this demo, you'll understand:

- ✅ **Serverless computing** concepts and benefits
- ✅ **Azure Functions** HTTP triggers and bindings
- ✅ **Event-driven architecture** patterns
- ✅ **Infrastructure as Code** with Bicep templates
- ✅ **CI/CD pipelines** for serverless applications
- ✅ **Monitoring and logging** in Azure Functions
- ✅ **Cost optimization** with consumption-based pricing

## 💰 Cost Considerations

This demo uses:
- **Function App (Consumption Plan)**: Pay per execution (~$0.20 per 1M executions)
- **Storage Account**: Required for Functions (~$0.02/GB/month)
- **Application Insights**: Free tier includes 1GB/month

Typical monthly cost for development/testing: **< $5**

## 🧹 Cleanup

To avoid ongoing charges, delete all resources:

```bash
# Using Azure CLI
az group delete --name rg-functions-demo --yes --no-wait

# Using PowerShell script
.\scripts\cleanup.ps1 -ResourceGroupName "rg-functions-demo"
```

## 🔗 Additional Resources

- [Azure Functions Documentation](https://docs.microsoft.com/en-us/azure/azure-functions/)
- [Azure Functions Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local)
- [Bicep Documentation](https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/)
- [GitHub Actions for Azure](https://docs.microsoft.com/en-us/azure/developer/github/github-actions)

---

## 🎯 Next Steps

Ready for more Azure services? Check out other branches:
- `01-app-service` - Web app hosting
- `03-blob-storage` - File storage and management
- `04-cosmos-db` - NoSQL database integration
- `05-key-vault` - Secrets management

Each branch builds upon previous concepts while remaining independently deployable.

---

*This is a standalone demo focused solely on Azure Functions. No external dependencies or multi-service integration required.*