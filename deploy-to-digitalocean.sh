#!/bin/bash

echo "🚀 OptiSigns - Digital Ocean Deployment Preparation"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if GitHub repo exists
echo -e "${BLUE}Step 1: Checking Git repository...${NC}"
if [ ! -d .git ]; then
    echo "Initializing Git repository..."
    git init
fi

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo -e "${YELLOW}You have uncommitted changes. Committing them now...${NC}"
    git add .
    git commit -m "Prepare for Digital Ocean deployment"
fi

# Generate secure JWT secret
echo ""
echo -e "${BLUE}Step 2: Generating secure JWT secret...${NC}"
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
echo -e "${GREEN}✓ JWT Secret generated${NC}"
echo ""
echo "Add this to your Digital Ocean environment variables:"
echo "JWT_SECRET=${JWT_SECRET}"
echo ""

# Instructions
echo -e "${BLUE}Step 3: Next Steps for Deployment${NC}"
echo ""
echo "1️⃣  Push your code to GitHub:"
echo "   ${YELLOW}git remote add origin https://github.com/YOUR_USERNAME/optisigns-onboarding.git${NC}"
echo "   ${YELLOW}git branch -M main${NC}"
echo "   ${YELLOW}git push -u origin main${NC}"
echo ""

echo "2️⃣  Go to Digital Ocean App Platform:"
echo "   https://cloud.digitalocean.com/apps"
echo ""

echo "3️⃣  Click 'Create App' and connect your GitHub repository"
echo ""

echo "4️⃣  Choose deployment method:"
echo "   ${GREEN}Option A:${NC} Use the app spec file (.do/app.yaml)"
echo "   ${GREEN}Option B:${NC} Configure manually (see DEPLOYMENT.md)"
echo ""

echo "5️⃣  Set these environment variables in Digital Ocean:"
echo "   ${YELLOW}Backend:${NC}"
echo "   - NODE_ENV=production"
echo "   - PORT=8080"
echo "   - JWT_SECRET=${JWT_SECRET}"
echo "   - JWT_EXPIRES_IN=7d"
echo "   - MONGODB_URI=mongodb+srv://kathrynbuckley_db_user:KKwx8mSwKDXTKmSL@cluster0.f7fzwx8.mongodb.net/optisigns-onboarding?retryWrites=true&w=majority&appName=Cluster0"
echo "   - CORS_ORIGIN=<your-frontend-url>"
echo ""

echo "6️⃣  Configure MongoDB Atlas:"
echo "   - Go to Network Access"
echo "   - Add IP Address: 0.0.0.0/0 (Allow from anywhere)"
echo "   - Or add specific Digital Ocean IP ranges"
echo ""

echo "7️⃣  Deploy and test your application!"
echo ""

echo -e "${GREEN}✓ Preparation complete!${NC}"
echo ""
echo "📖 For detailed instructions, see: ${BLUE}DEPLOYMENT.md${NC}"
echo ""
