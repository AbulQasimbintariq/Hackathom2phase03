#!/bin/bash
# Setup script for deployment preparation

echo "🚀 Task App Deployment Setup"
echo "=============================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already initialized"
fi

# Check Node/NPM for frontend
echo ""
echo "🔍 Checking frontend dependencies..."
if [ -d "frontend" ]; then
    cd frontend
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing frontend dependencies..."
        npm install
    else
        echo "✅ Frontend dependencies installed"
    fi
    
    # Test build
    echo "🔨 Testing frontend build..."
    npm run build
    if [ $? -eq 0 ]; then
        echo "✅ Frontend build successful"
    else
        echo "❌ Frontend build failed - fix errors above"
        exit 1
    fi
    cd ..
else
    echo "❌ frontend directory not found"
    exit 1
fi

# Check Python for backend
echo ""
echo "🔍 Checking backend dependencies..."
if [ -d "backend" ]; then
    cd backend
    
    # Check Python version
    python_version=$(python3 --version 2>&1 | awk '{print $2}')
    echo "Python version: $python_version"
    
    if [ ! -d "venv" ] && [ ! -d ".venv" ]; then
        echo "📦 Creating Python virtual environment..."
        python3 -m venv venv
        source venv/bin/activate
    fi
    
    # Install dependencies
    echo "📦 Installing backend dependencies..."
    pip install -r requirements.txt
    
    if [ $? -eq 0 ]; then
        echo "✅ Backend dependencies installed"
    else
        echo "❌ Backend dependency installation failed"
        exit 1
    fi
    
    cd ..
else
    echo "❌ backend directory not found"
    exit 1
fi

echo ""
echo "=============================="
echo "✅ Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Create GitHub account and push this repo"
echo "2. Go to vercel.com and connect your GitHub repo"
echo "3. Deploy frontend on Vercel"
echo "4. Deploy backend on Railway/Render"
echo "5. Update NEXT_PUBLIC_API_BASE in Vercel with backend URL"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
