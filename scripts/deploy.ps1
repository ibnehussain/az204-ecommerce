# Azure Functions Deployment Script
# This script deploys the Azure Functions demo to Azure

param(
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroupName,
    
    [Parameter(Mandatory=$true)]
    [string]$FunctionAppName,
    
    [Parameter(Mandatory=$false)]
    [string]$Location = "East US"
)

Write-Host "🚀 Starting Azure Functions Demo Deployment..." -ForegroundColor Green

# Check if logged into Azure
$context = Get-AzContext
if (-not $context) {
    Write-Host "❌ Not logged into Azure. Please run 'Connect-AzAccount' first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Azure context found: $($context.Account.Id)" -ForegroundColor Green

# Create resource group if it doesn't exist
Write-Host "📦 Checking resource group: $ResourceGroupName" -ForegroundColor Yellow
$rg = Get-AzResourceGroup -Name $ResourceGroupName -ErrorAction SilentlyContinue
if (-not $rg) {
    Write-Host "Creating resource group: $ResourceGroupName in $Location" -ForegroundColor Yellow
    $rg = New-AzResourceGroup -Name $ResourceGroupName -Location $Location
    Write-Host "✅ Resource group created" -ForegroundColor Green
} else {
    Write-Host "✅ Resource group exists" -ForegroundColor Green
}

# Deploy infrastructure using Bicep
Write-Host "🏗️ Deploying infrastructure..." -ForegroundColor Yellow
$deploymentName = "functions-demo-$(Get-Date -Format 'yyyyMMdd-HHmmss')"

try {
    $deployment = New-AzResourceGroupDeployment `
        -ResourceGroupName $ResourceGroupName `
        -Name $deploymentName `
        -TemplateFile "./infrastructure/function-app.bicep" `
        -appName $FunctionAppName `
        -location $Location `
        -Verbose

    if ($deployment.ProvisioningState -eq "Succeeded") {
        Write-Host "✅ Infrastructure deployed successfully" -ForegroundColor Green
        
        # Get the deployed function app name (might have uniqueString suffix)
        $deployedFunctionAppName = $deployment.Outputs.functionAppName.Value
        Write-Host "📱 Function App Name: $deployedFunctionAppName" -ForegroundColor Cyan
        Write-Host "🌐 Function App URL: https://$($deployment.Outputs.functionAppDefaultHostName.Value)" -ForegroundColor Cyan
        
        # Install dependencies and create deployment package
        Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
        Push-Location "./src/functions"
        npm install --production
        Pop-Location
        
        # Create ZIP package for deployment
        Write-Host "📦 Creating deployment package..." -ForegroundColor Yellow
        $tempPath = Join-Path $env:TEMP "functions-deploy-$(Get-Date -Format 'yyyyMMddHHmmss')"
        New-Item -ItemType Directory -Path $tempPath -Force | Out-Null
        
        # Copy function files
        Copy-Item -Path "./src/functions/*" -Destination $tempPath -Recurse -Force
        
        # Create ZIP
        $zipPath = "$tempPath.zip"
        Compress-Archive -Path "$tempPath\*" -DestinationPath $zipPath -Force
        
        # Deploy function code
        Write-Host "🚀 Deploying function code..." -ForegroundColor Yellow
        Publish-AzWebApp -ResourceGroupName $ResourceGroupName -Name $deployedFunctionAppName -ArchivePath $zipPath -Force
        
        # Cleanup
        Remove-Item -Path $tempPath -Recurse -Force -ErrorAction SilentlyContinue
        Remove-Item -Path $zipPath -Force -ErrorAction SilentlyContinue
        
        Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
        Write-Host "🔗 Function URL: https://$($deployment.Outputs.functionAppDefaultHostName.Value)/api/orders" -ForegroundColor Cyan
        Write-Host "📊 Test your function with a POST request to the URL above" -ForegroundColor Yellow
        
    } else {
        Write-Host "❌ Infrastructure deployment failed" -ForegroundColor Red
        Write-Host $deployment.Error -ForegroundColor Red
        exit 1
    }
    
} catch {
    Write-Host "❌ Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n✨ Quick Test Commands:" -ForegroundColor Magenta
Write-Host "# Test the function with curl:" -ForegroundColor Gray
Write-Host "curl -X POST https://$($deployment.Outputs.functionAppDefaultHostName.Value)/api/orders \\" -ForegroundColor Gray
Write-Host "  -H 'Content-Type: application/json' \\" -ForegroundColor Gray
Write-Host "  -d '{\"customerName\":\"John Doe\",\"items\":[{\"name\":\"Widget\",\"quantity\":2,\"price\":10.99}]}'" -ForegroundColor Gray

Write-Host "`n# Or test with PowerShell:" -ForegroundColor Gray
Write-Host "`$body = @{" -ForegroundColor Gray
Write-Host "  customerName = 'Jane Smith'" -ForegroundColor Gray
Write-Host "  items = @(@{name='Gadget'; quantity=1; price=25.50})" -ForegroundColor Gray
Write-Host "} | ConvertTo-Json -Depth 3" -ForegroundColor Gray
Write-Host "Invoke-RestMethod -Uri 'https://$($deployment.Outputs.functionAppDefaultHostName.Value)/api/orders' -Method POST -Body `$body -ContentType 'application/json'" -ForegroundColor Gray