#!/bin/bash

# QueueLess Print - Setup Script
# This script helps you set up the application

echo "================================"
echo "QueueLess Print - Setup Script"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js is installed: $(node -v)"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed successfully"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
cd ..
echo ""

# Install frontend dependencies  
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed successfully"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
cd ..
echo ""

# Check if .env exists
if [ ! -f backend/.env ]; then
    echo "⚠️  Backend .env file not found. Creating default .env..."
    cat > backend/.env << EOF
JWT_SECRET=your_jwt_secret_key_change_in_production
MONGODB_URI=mongodb://127.0.0.1:27017/queuelessprint
PORT=5000
NODE_ENV=development
EOF
    echo "✅ Created backend/.env. Please update JWT_SECRET!"
else
    echo "✅ Backend .env already exists"
fi
echo ""

echo "================================"
echo "✅ Setup Complete!"
echo "================================"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Make sure MongoDB is running on localhost:27017"
echo ""
echo "2. Update backend/.env with your configuration:"
echo "   - Change JWT_SECRET to a strong random string"
echo "   - Update MONGODB_URI if needed"
echo ""
echo "3. Start the backend (in one terminal):"
echo "   cd backend && npm start"
echo ""
echo "4. Start the frontend (in another terminal):"
echo "   cd frontend && npm run dev"
echo ""
echo "5. Open your browser: http://localhost:5173"
echo ""
echo "📚 For more information, see SETUP_GUIDE.md"
echo ""
