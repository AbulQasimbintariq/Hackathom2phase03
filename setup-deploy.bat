@echo off
REM Setup script for deployment preparation (Windows)

echo 🚀 Task App Deployment Setup
echo ==============================

REM Check if git is initialized
if not exist .git (
    echo 📦 Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit"
    echo ✅ Git repository initialized
) else (
    echo ✅ Git repository already initialized
)

REM Check Node/NPM for frontend
echo.
echo 🔍 Checking frontend dependencies...
if exist frontend (
    cd frontend
    if not exist node_modules (
        echo 📦 Installing frontend dependencies...
        call npm install
    ) else (
        echo ✅ Frontend dependencies installed
    )
    
    REM Test build
    echo 🔨 Testing frontend build...
    call npm run build
    if errorlevel 1 (
        echo ❌ Frontend build failed - fix errors above
        exit /b 1
    ) else (
        echo ✅ Frontend build successful
    )
    cd ..
) else (
    echo ❌ frontend directory not found
    exit /b 1
)

REM Check Python for backend
echo.
echo 🔍 Checking backend dependencies...
if exist backend (
    cd backend
    
    REM Check Python version
    python --version
    
    if not exist venv (
        if not exist .venv (
            echo 📦 Creating Python virtual environment...
            python -m venv venv
            call venv\Scripts\activate.bat
        )
    )
    
    REM Install dependencies
    echo 📦 Installing backend dependencies...
    pip install -r requirements.txt
    
    if errorlevel 1 (
        echo ❌ Backend dependency installation failed
        exit /b 1
    ) else (
        echo ✅ Backend dependencies installed
    )
    
    cd ..
) else (
    echo ❌ backend directory not found
    exit /b 1
)

echo.
echo ==============================
echo ✅ Setup Complete!
echo.
echo 📋 Next Steps:
echo 1. Create GitHub account and push this repo
echo 2. Go to vercel.com and connect your GitHub repo
echo 3. Deploy frontend on Vercel
echo 4. Deploy backend on Railway/Render
echo 5. Update NEXT_PUBLIC_API_BASE in Vercel with backend URL
echo.
echo 📖 For detailed instructions, see DEPLOYMENT.md
