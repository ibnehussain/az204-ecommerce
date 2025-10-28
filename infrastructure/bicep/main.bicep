@description('The environment name (e.g., dev, test, prod)')
param environmentName string = 'dev'

@description('The location for all resources')
param location string = resourceGroup().location

@description('The prefix for all resource names')
param resourcePrefix string = 'ecomm'

@description('Tags to apply to all resources')
param tags object = {
  Environment: environmentName
  Project: 'Azure-Ecommerce-Demo'
}

@description('The SKU for the App Service Plan')
@allowed(['F1', 'D1', 'B1', 'B2', 'B3', 'S1', 'S2', 'S3', 'P1', 'P2', 'P3'])
param appServicePlanSku string = 'F1'

@description('The Node.js version for the web app')
param nodeVersion string = '18-lts'

// Variables
var appServicePlanName = 'asp-${resourcePrefix}-${environmentName}'
var webAppName = 'app-${resourcePrefix}-${environmentName}-${uniqueString(resourceGroup().id)}'
var functionAppName = 'func-${resourcePrefix}-${environmentName}-${uniqueString(resourceGroup().id)}'
var storageAccountName = 'st${resourcePrefix}${environmentName}${uniqueString(resourceGroup().id, resourcePrefix)}'
var cosmosAccountName = 'cosmos-${resourcePrefix}-${environmentName}-${uniqueString(resourceGroup().id)}'
var keyVaultName = 'kv-${resourcePrefix}-${environmentName}-${uniqueString(resourceGroup().id)}'
var appConfigName = 'appconfig-${resourcePrefix}-${environmentName}-${uniqueString(resourceGroup().id)}'
var logAnalyticsName = 'log-${resourcePrefix}-${environmentName}'
var appInsightsName = 'appi-${resourcePrefix}-${environmentName}'

// App Service Plan
resource appServicePlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: appServicePlanName
  location: location
  tags: tags
  sku: {
    name: appServicePlanSku
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

// Storage Account (for Azure Functions and Blob Storage)
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageAccountName
  location: location
  tags: tags
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    supportsHttpsTrafficOnly: true
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: true
    accessTier: 'Hot'
  }
}

// Blob Storage Container for product images
resource blobContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-01-01' = {
  name: '${storageAccount.name}/default/product-images'
  properties: {
    publicAccess: 'Blob'
  }
}

// Web App
resource webApp 'Microsoft.Web/sites@2023-01-01' = {
  name: webAppName
  location: location
  tags: tags
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'NODE|${nodeVersion}'
      appSettings: [
        {
          name: 'NODE_ENV'
          value: environmentName
        }
        {
          name: 'PORT'
          value: '3001'
        }
        {
          name: 'FRONTEND_URL'
          value: 'https://${webAppName}.azurewebsites.net'
        }
        {
          name: 'STORAGE_ACCOUNT_NAME'
          value: storageAccount.name
        }
        {
          name: 'STORAGE_CONTAINER_NAME'
          value: 'product-images'
        }
      ]
      cors: {
        allowedOrigins: [
          'https://${webAppName}.azurewebsites.net'
          'http://localhost:3000'
        ]
        supportCredentials: false
      }
      alwaysOn: appServicePlanSku != 'F1' && appServicePlanSku != 'D1'
    }
  }
}

// Log Analytics Workspace
resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: logAnalyticsName
  location: location
  tags: tags
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
  }
}

// Application Insights
resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  tags: tags
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalytics.id
  }
}

// Outputs
output webAppName string = webApp.name
output webAppUrl string = 'https://${webApp.name}.azurewebsites.net'
output storageAccountName string = storageAccount.name
output appInsightsInstrumentationKey string = appInsights.properties.InstrumentationKey
output appInsightsConnectionString string = appInsights.properties.ConnectionString
output resourceGroupName string = resourceGroup().name
