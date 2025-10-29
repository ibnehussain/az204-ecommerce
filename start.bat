@echo off
echo 🚀 Starting Azure E-commerce Demo...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js 18+
    pause
    exit /b 1
)

echo ✅ Node.js found
echo 🔧 Starting backend server...

REM Start backend in new window
start "E-commerce Backend" cmd /k "cd /d %~dp0src\backend && npm start"

REM Wait for backend to start
timeout /t 3 >nul

echo 🎨 Starting frontend server...

REM Start frontend in new window
start "E-commerce Frontend" cmd /k "cd /d %~dp0src\frontend && npm start"

echo.
echo 🌐 Application URLs:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:3001/api/health
echo.
echo ✨ Both services are starting in separate windows...
echo 📖 Check the README-module-01.md for more information
echo.
echo © 2025 Azhar. All rights reserved.
pause