targetScope = 'subscription'

@description('The environment name (e.g., dev, test, prod)')
param environmentName string = 'dev'

@description('The location for all resources')
param location string = 'East US'

@description('The prefix for all resource names')
param resourcePrefix string = 'ecomm'

@description('Tags to apply to all resources')
param tags object = {
  Environment: environmentName
  Project: 'Azure-Ecommerce-Demo'
  CreatedBy: 'Bicep'
}

// Create resource group
resource rg 'Microsoft.Resources/resourceGroups@2023-07-01' = {
  name: 'rg-${resourcePrefix}-${environmentName}'
  location: location
  tags: tags
}

// Deploy main resources
module mainResources 'main.bicep' = {
  scope: rg
  params: {
    environmentName: environmentName
    location: location
    resourcePrefix: resourcePrefix
    tags: tags
  }
}

// Outputs
output resourceGroupName string = rg.name
output location string = location
output environmentName string = environmentName
