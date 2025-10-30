# Azure Functions Demo Cleanup Script
# This script removes all resources created for the Azure Functions demo

param(
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroupName,
    
    [Parameter(Mandatory=$false)]
    [switch]$Force
)

Write-Host "🧹 Azure Functions Demo Cleanup" -ForegroundColor Yellow

# Check if logged into Azure
$context = Get-AzContext
if (-not $context) {
    Write-Host "❌ Not logged into Azure. Please run 'Connect-AzAccount' first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Azure context found: $($context.Account.Id)" -ForegroundColor Green

# Check if resource group exists
$rg = Get-AzResourceGroup -Name $ResourceGroupName -ErrorAction SilentlyContinue
if (-not $rg) {
    Write-Host "ℹ️ Resource group '$ResourceGroupName' does not exist or has already been deleted." -ForegroundColor Yellow
    exit 0
}

# List resources in the group
Write-Host "📋 Resources in '$ResourceGroupName':" -ForegroundColor Cyan
$resources = Get-AzResource -ResourceGroupName $ResourceGroupName
$resources | Format-Table Name, ResourceType, Location -AutoSize

if ($resources.Count -eq 0) {
    Write-Host "ℹ️ No resources found in resource group." -ForegroundColor Yellow
    
    if (-not $Force) {
        $confirm = Read-Host "Do you want to delete the empty resource group? (y/N)"
        if ($confirm -ne 'y' -and $confirm -ne 'Y') {
            Write-Host "❌ Cleanup cancelled." -ForegroundColor Yellow
            exit 0
        }
    }
    
    Write-Host "🗑️ Deleting empty resource group..." -ForegroundColor Yellow
    Remove-AzResourceGroup -Name $ResourceGroupName -Force
    Write-Host "✅ Empty resource group deleted." -ForegroundColor Green
    exit 0
}

# Estimate costs being removed
Write-Host "`n💰 Resources to be deleted:" -ForegroundColor Red
$resources | ForEach-Object {
    $costInfo = switch ($_.ResourceType) {
        "Microsoft.Web/sites" { "Function App (Consumption plan - Pay per execution)" }
        "Microsoft.Web/serverfarms" { "App Service Plan (Consumption - Free tier)" }
        "Microsoft.Storage/storageAccounts" { "Storage Account (Standard LRS - ~$0.02/GB/month)" }
        "Microsoft.Insights/components" { "Application Insights (Free tier up to 1GB/month)" }
        default { "Unknown cost impact" }
    }
    Write-Host "  • $($_.Name) ($($_.ResourceType)) - $costInfo" -ForegroundColor Red
}

# Confirmation
if (-not $Force) {
    Write-Host "`n⚠️ This will permanently delete ALL resources in the resource group!" -ForegroundColor Red
    $confirm = Read-Host "Are you sure you want to continue? Type 'DELETE' to confirm"
    
    if ($confirm -ne 'DELETE') {
        Write-Host "❌ Cleanup cancelled. Resource group preserved." -ForegroundColor Yellow
        exit 0
    }
}

# Delete the resource group and all resources
Write-Host "🚨 Deleting resource group and all resources..." -ForegroundColor Red
try {
    Remove-AzResourceGroup -Name $ResourceGroupName -Force -AsJob | Out-Null
    
    Write-Host "✅ Deletion initiated. This may take several minutes to complete." -ForegroundColor Green
    Write-Host "💡 You can check the progress in the Azure portal or run:" -ForegroundColor Yellow
    Write-Host "   Get-AzResourceGroup -Name '$ResourceGroupName' -ErrorAction SilentlyContinue" -ForegroundColor Gray
    Write-Host "   (Returns nothing when deletion is complete)" -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Failed to delete resource group: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n🎉 Cleanup completed! All Azure resources have been scheduled for deletion." -ForegroundColor Green
Write-Host "💡 Note: It may take 5-10 minutes for all resources to be fully removed from Azure." -ForegroundColor Yellow