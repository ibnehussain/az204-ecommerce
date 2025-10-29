# Backend - Azure Functions Integration

The backend has been modified to integrate with Azure Functions for order processing.

## 🔄 **New Architecture**

```
Frontend → Express Backend → Azure Function → Response
```

### **Before (01-app-service)**
- Orders handled directly in Express server
- In-memory storage
- Simple REST API

### **After (02-functions)**
- Orders routed through Azure Functions
- Serverless processing
- Enhanced error handling and logging

## 📡 **New Endpoints**

### **POST /api/orders**
Processes orders via Azure Function integration

**Request:**
```json
{
  "productId": "laptop-pro-2024",
  "quantity": 2
}
```

**Response (Success):**
```json
{
  "status": "Order received",
  "orderId": "550e8400-e29b-41d4-a716-446655440000",
  "productId": "laptop-pro-2024",
  "quantity": 2,
  "message": "Your order has been successfully received and is being processed",
  "timestamp": "2025-10-29T10:30:00.000Z",
  "requestId": "123e4567-e89b-12d3-a456-426614174000",
  "processedBy": "Azure Functions",
  "backendTimestamp": "2025-10-29T10:30:00.100Z"
}
```

### **GET /api/orders/health**
Health check for Azure Function connectivity

**Response:**
```json
{
  "status": "healthy",
  "message": "Azure Function integration is configured",
  "functionUrl": "[CONFIGURED]",
  "checkId": "health-123",
  "timestamp": "2025-10-29T10:30:00.000Z"
}
```

### **GET /api/orders/config** (Development only)
Returns configuration status for debugging

## ⚙️ **Configuration**

### **Environment Variables**
Add to your `.env` file:
```bash
# Azure Functions
FUNCTION_URL=http://localhost:7071/api/orders
```

### **Local Development Setup**
1. **Start Azure Functions:**
   ```powershell
   cd C:\az204\src\functions
   func start
   ```

2. **Start Backend Server:**
   ```powershell
   cd C:\az204\src\backend
   npm run dev
   ```

3. **Test Integration:**
   ```powershell
   $body = @{
       productId = "test-product"
       quantity = 1
   } | ConvertTo-Json

   Invoke-RestMethod -Uri "http://localhost:3001/api/orders" -Method Post -Body $body -ContentType "application/json"
   ```

## 🔍 **Error Handling**

The backend includes comprehensive error handling for Azure Function integration:

### **Configuration Errors**
- **500**: FUNCTION_URL not configured
- **502**: Azure Function endpoint not found
- **503**: Unable to connect to Azure Function
- **504**: Azure Function request timeout

### **Validation Errors**
- **400**: Missing or invalid productId/quantity

### **Function Errors**
- Passes through Azure Function error responses
- Adds request tracking and logging

## 📊 **Logging**

Each request includes detailed logging with unique request IDs:

```
[requestId] Order request received: { body, timestamp, userAgent, clientIp }
[requestId] Calling Azure Function: { url, payload, timestamp }
[requestId] Azure Function response: { status, data, timestamp }
[requestId] Order processed successfully via Azure Function
```

## 🧪 **Testing**

### **Unit Testing** (Future)
```javascript
// Example test structure
describe('Orders API', () => {
  test('should call Azure Function for order processing', async () => {
    // Test implementation
  });
});
```

### **Integration Testing**
```powershell
# Test order processing flow
$response = Invoke-RestMethod -Uri "http://localhost:3001/api/orders" -Method Post -Body '{"productId":"test","quantity":1}' -ContentType "application/json"

# Verify response includes both backend and function data
Write-Output $response.requestId
Write-Output $response.processedBy # Should be "Azure Functions"
```

## 🚀 **Production Deployment**

### **Environment Configuration**
```bash
# Production Azure Function URL
FUNCTION_URL=https://your-function-app.azurewebsites.net/api/orders
```

### **Monitoring**
- Request IDs for tracing across services
- Detailed error logging for troubleshooting
- Health check endpoints for monitoring

## 📁 **File Changes**

### **New Files:**
- `src/backend/routes/orders.js` - Azure Function integration routes

### **Modified Files:**
- `src/backend/server.js` - Added orders routes registration
- `src/backend/package.json` - Added axios dependency
- `.env.example` - Added FUNCTION_URL configuration

### **Legacy Support:**
- `/api/orders-legacy` endpoints maintained for backward compatibility
- Existing in-memory orders array preserved