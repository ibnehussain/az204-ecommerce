using 'deploy.bicep'

param environmentName = 'dev'
param location = 'East US'
param resourcePrefix = 'ecomm'
param tags = {
  Environment: 'dev'
  Project: 'Azure-Ecommerce-Demo'
  CreatedBy: 'Bicep'
  Owner: 'Development Team'
}
