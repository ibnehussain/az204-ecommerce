# PowerShell startup script for Azure E-commerce Demo
# Run this script to start both frontend and backend services

Write-Host "🚀 Starting Azure E-commerce Demo..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

# Start backend in new window
Write-Host "🔧 Starting backend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\src\backend'; npm start"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend in new window  
Write-Host "🎨 Starting frontend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\src\frontend'; npm start"

Write-Host ""
Write-Host "🌐 Application URLs:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:  http://localhost:3001/api/health" -ForegroundColor White
Write-Host ""
Write-Host "✨ Both services are starting in separate windows..." -ForegroundColor Green
Write-Host "📖 Check the README-module-01.md for more information" -ForegroundColor Blue
Write-Host ""
Write-Host "© 2025 Azhar. All rights reserved." -ForegroundColor Gray