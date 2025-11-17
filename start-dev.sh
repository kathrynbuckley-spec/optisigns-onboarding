#!/bin/bash

# OptiSigns Onboarding - Development Startup Script
# This script starts both frontend and backend in development mode

echo "🚀 OptiSigns Onboarding - Starting Development Environment"
echo "=========================================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js version: $(node --version)${NC}"
echo ""

# Check if dependencies are installed
if [ ! -d "backend/node_modules" ] || [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}⚠️  Dependencies not found. Installing...${NC}"
    echo ""

    echo -e "${BLUE}Installing backend dependencies...${NC}"
    cd backend && npm install

    echo ""
    echo -e "${BLUE}Installing frontend dependencies...${NC}"
    cd ../frontend && npm install

    cd ..
    echo -e "${GREEN}✓ Dependencies installed${NC}"
    echo ""
fi

# Check if .env exists in backend
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  backend/.env file not found${NC}"
    echo -e "${BLUE}Creating backend/.env from template...${NC}"
    cat > backend/.env << 'EOF'
PORT=3000
NODE_ENV=development
JWT_SECRET=dev-secret-change-in-production
JWT_EXPIRES_IN=7d
MONGODB_URI=mongodb+srv://kathrynbuckley_db_user:KKwx8mSwKDXTKmSL@cluster0.f7fzwx8.mongodb.net/optisigns-onboarding?retryWrites=true&w=majority&appName=Cluster0
CORS_ORIGIN=http://localhost:4200
EOF
    echo -e "${GREEN}✓ Created backend/.env${NC}"
    echo ""
fi

# Start both services
echo -e "${BLUE}Starting services...${NC}"
echo ""
echo -e "${GREEN}Backend:${NC}  http://localhost:3000"
echo -e "${GREEN}Frontend:${NC} http://localhost:4200"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop both services${NC}"
echo ""

# Start backend and frontend concurrently
(cd backend && npm run dev) &
BACKEND_PID=$!

(cd frontend && npm start) &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
