@echo off
REM QueueLess Print - Setup Script for Windows
REM This script helps you set up the application

echo ================================
echo QueueLess Print - Setup Script
echo ================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo X Node.js is not installed. Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo. Node.js is installed: %NODE_VERSION%
echo.

REM Install backend dependencies
echo. Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo X Failed to install backend dependencies
    pause
    exit /b 1
)
echo. Backend dependencies installed successfully
cd ..
echo.

REM Install frontend dependencies
echo. Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo X Failed to install frontend dependencies
    pause
    exit /b 1
)
echo. Frontend dependencies installed successfully
cd ..
echo.

REM Check if .env exists
if not exist backend\.env (
    echo. Backend .env file not found. Creating default .env...
    (
        echo JWT_SECRET=your_jwt_secret_key_change_in_production
        echo MONGODB_URI=mongodb://127.0.0.1:27017/queuelessprint
        echo PORT=5000
        echo NODE_ENV=development
    ) > backend\.env
    echo. Created backend\.env. Please update JWT_SECRET!
) else (
    echo. Backend .env already exists
)
echo.

echo ================================
echo. Setup Complete!
echo ================================
echo.
echo. Next steps:
echo.
echo 1. Make sure MongoDB is running on localhost:27017
echo.
echo 2. Update backend\.env with your configuration:
echo    - Change JWT_SECRET to a strong random string
echo    - Update MONGODB_URI if needed
echo.
echo 3. Start the backend ^(in one terminal^):
echo    cd backend ^&^& npm start
echo.
echo 4. Start the frontend ^(in another terminal^):
echo    cd frontend ^&^& npm run dev
echo.
echo 5. Open your browser: http://localhost:5173
echo.
echo. For more information, see SETUP_GUIDE.md
echo.
pause
