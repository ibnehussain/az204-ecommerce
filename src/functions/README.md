# Azure Functions - OrderProcessor

This directory contains Azure Functions for the AZ-204 E-commerce application.

## 🚀 OrderProcessor Function

An HTTP-triggered Azure Function that processes e-commerce orders.

### Function Details
- **Trigger**: HTTP POST
- **Endpoint**: `POST /api/orders`
- **Route**: `/api/orders` (configured in function.json)
- **Authentication**: Anonymous (no API key required)

### Request Format
```json
{
  "productId": "product-123",
  "quantity": 2
}
```

### Response Format
```json
{
  "status": "Order received",
  "orderId": "550e8400-e29b-41d4-a716-446655440000",
  "productId": "product-123",
  "quantity": 2,
  "message": "Your order has been successfully received and is being processed",
  "timestamp": "2025-10-29T10:30:00.000Z"
}
```

## 🛠️ Local Development Setup

### Prerequisites
1. **Node.js**: Version 18.x or higher
2. **Azure Functions Core Tools**: Version 4.x
3. **Azure CLI**: For deployment (optional for local development)

### Install Azure Functions Core Tools
```powershell
# Install via npm (recommended)
npm install -g azure-functions-core-tools@4 --unsafe-perm true

# Or install via chocolatey (Windows)
choco install azure-functions-core-tools-4

# Or install via winget (Windows 10+)
winget install Microsoft.AzureFunctionsCoreTools
```

### Install Dependencies
```powershell
# Navigate to the functions directory
cd C:\az204\src\functions

# Install npm dependencies
npm install
```

## 🏃‍♂️ Running Locally

### Start the Functions Runtime
```powershell
# From the functions directory (C:\az204\src\functions)
func start

# Or use npm script
npm start
```

### Expected Output
```
Azure Functions Core Tools
Core Tools Version:       4.0.5455 Commit hash: N/A  (64-bit)
Function Runtime Version: 4.21.3.20404

[2025-10-29T10:30:00.000Z] Host lock lease acquired by instance ID '000000000000000000000000'.
[2025-10-29T10:30:00.000Z] Host started (1234ms)
[2025-10-29T10:30:00.000Z] Job host started

Functions:
        OrderProcessor: [POST] http://localhost:7071/api/orders
```

## 🧪 Testing the Function

### Test with PowerShell
```powershell
# Valid order request
$body = @{
    productId = "laptop-pro-2024"
    quantity = 2
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:7071/api/orders" -Method Post -Body $body -ContentType "application/json"
Write-Output $response
```

### Test with curl
```bash
# Valid order request
curl -X POST http://localhost:7071/api/orders \
  -H "Content-Type: application/json" \
  -d '{"productId": "laptop-pro-2024", "quantity": 2}'

# Invalid request (missing quantity)
curl -X POST http://localhost:7071/api/orders \
  -H "Content-Type: application/json" \
  -d '{"productId": "laptop-pro-2024"}'
```

### Test with Postman
1. **Method**: POST
2. **URL**: `http://localhost:7071/api/orders`
3. **Headers**: 
   - `Content-Type: application/json`
4. **Body** (raw JSON):
   ```json
   {
     "productId": "laptop-pro-2024",
     "quantity": 2
   }
   ```

## 📊 Function Logs

The function logs detailed information for monitoring and debugging:

```
[2025-10-29T10:30:00.000Z] Executing 'Functions.OrderProcessor' (Reason='This function was programmatically called via the host APIs.', Id=12345678-1234-1234-1234-123456789012)
[2025-10-29T10:30:00.000Z] OrderProcessor function triggered
[2025-10-29T10:30:00.000Z] Order received: {"orderId":"550e8400-e29b-41d4-a716-446655440000","productId":"laptop-pro-2024","quantity":2,"timestamp":"2025-10-29T10:30:00.000Z","userAgent":"Mozilla/5.0...","clientIp":"127.0.0.1"}
[2025-10-29T10:30:00.000Z] Processing order 550e8400-e29b-41d4-a716-446655440000 for product laptop-pro-2024 (quantity: 2)
[2025-10-29T10:30:00.000Z] Order 550e8400-e29b-41d4-a716-446655440000 processed successfully
[2025-10-29T10:30:00.000Z] Executed 'Functions.OrderProcessor' (Succeeded, Id=12345678-1234-1234-1234-123456789012, Duration=45ms)
```

## 🚀 Deployment to Azure

### Create Function App
```powershell
# Set variables
$resourceGroup = "rg-az204-functions"
$functionAppName = "func-az204-ecommerce-$(Get-Random)"
$storageAccount = "staz204func$(Get-Random)"
$location = "East US"

# Create resource group
az group create --name $resourceGroup --location $location

# Create storage account
az storage account create --name $storageAccount --resource-group $resourceGroup --location $location --sku Standard_LRS

# Create function app
az functionapp create --resource-group $resourceGroup --consumption-plan-location $location --runtime node --runtime-version 18 --functions-version 4 --name $functionAppName --storage-account $storageAccount
```

### Deploy Function
```powershell
# From the functions directory
func azure functionapp publish $functionAppName

# Or use Azure CLI
az functionapp deployment source config-zip --resource-group $resourceGroup --name $functionAppName --src deploy.zip
```

### Test Deployed Function
```powershell
$deployedUrl = "https://$functionAppName.azurewebsites.net/api/orders"
$body = @{
    productId = "laptop-pro-2024"
    quantity = 1
} | ConvertTo-Json

Invoke-RestMethod -Uri $deployedUrl -Method Post -Body $body -ContentType "application/json"
```

## 📁 File Structure

```
src/functions/
├── OrderProcessor/
│   ├── function.json          # Function bindings and triggers
│   └── index.js               # Function implementation
├── host.json                  # Functions runtime configuration
├── local.settings.json        # Local development settings
├── package.json              # Dependencies and scripts
└── README.md                 # This documentation
```

## 🔧 Configuration Files

### function.json
- Defines HTTP trigger with POST method only
- Sets route to `/api/orders`
- Configures anonymous authentication
- Sets up HTTP response binding

### host.json
- Functions runtime version 2.0
- Application Insights logging configuration
- Extension bundle for additional bindings
- 5-minute function timeout

### local.settings.json
- Development storage emulator configuration
- Node.js runtime specification
- Local HTTP port (7071)
- CORS settings for development

## 🛡️ Error Handling

The function includes comprehensive error handling:

- **400 Bad Request**: Invalid or missing required fields
- **405 Method Not Allowed**: Non-POST requests
- **500 Internal Server Error**: Unexpected errors

All errors include detailed messages and timestamps for debugging.

## 📈 Monitoring and Diagnostics

### Application Insights
- Automatic logging to Application Insights when deployed
- Custom telemetry for order tracking
- Performance monitoring and alerting

### Local Development
- Console logging with structured data
- Request/response timing
- Error stack traces

## 🔄 Integration with Frontend

The function is designed to integrate with the existing e-commerce frontend:

```javascript
// Frontend integration example
const processOrder = async (productId, quantity) => {
  try {
    const response = await fetch('http://localhost:7071/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, quantity }),
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('Order processed:', result.orderId);
      return result;
    } else {
      console.error('Order failed:', result.message);
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Network error:', error);
    throw error;
  }
};
```

## 🎯 Next Steps

1. **Database Integration**: Connect to Azure Cosmos DB or SQL Database
2. **Payment Processing**: Integrate with payment gateways
3. **Queue Processing**: Add Azure Service Bus for order queuing
4. **Authentication**: Implement Azure AD B2C for user authentication
5. **Event Sourcing**: Add Event Hubs for order events
6. **Notifications**: Integrate with Logic Apps for email/SMS notifications