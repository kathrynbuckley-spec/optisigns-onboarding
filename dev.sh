#!/bin/bash
# Local development script
# Use this instead of npm commands for local dev

echo "Starting OptiSigns Onboarding in development mode..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing root dependencies..."
    npm install --prefix . -f package.json.dev
fi

# Start both backend and frontend
npx concurrently \
    "cd backend && npm run dev" \
    "cd frontend && npm start"
