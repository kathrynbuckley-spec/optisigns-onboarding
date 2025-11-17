#!/bin/bash

echo "======================================"
echo "OptiSigns Deployment Validation Script"
echo "======================================"
echo ""

ERRORS=0

# Check 1: Verify root package.json is renamed
echo "✓ Checking root package.json..."
if [ -f "package.json" ]; then
  echo "  ❌ ERROR: package.json exists in root (should be package.json.dev)"
  echo "     This will cause Digital Ocean to use Node.js buildpack instead of Docker"
  ERRORS=$((ERRORS + 1))
else
  echo "  ✓ Root package.json correctly renamed/removed"
fi

# Check 2: Verify Dockerfiles exist
echo ""
echo "✓ Checking Dockerfiles..."
if [ ! -f "backend/Dockerfile" ]; then
  echo "  ❌ ERROR: backend/Dockerfile not found"
  ERRORS=$((ERRORS + 1))
else
  echo "  ✓ backend/Dockerfile exists"
fi

if [ ! -f "frontend/Dockerfile" ]; then
  echo "  ❌ ERROR: frontend/Dockerfile not found"
  ERRORS=$((ERRORS + 1))
else
  echo "  ✓ frontend/Dockerfile exists"
fi

# Check 3: Verify .dockerignore files
echo ""
echo "✓ Checking .dockerignore files..."
if [ ! -f "backend/.dockerignore" ]; then
  echo "  ⚠️  WARNING: backend/.dockerignore not found (recommended)"
else
  echo "  ✓ backend/.dockerignore exists"
fi

if [ ! -f "frontend/.dockerignore" ]; then
  echo "  ⚠️  WARNING: frontend/.dockerignore not found (recommended)"
else
  echo "  ✓ frontend/.dockerignore exists"
fi

# Check 4: Verify app.yaml exists
echo ""
echo "✓ Checking app.yaml..."
if [ ! -f "app.yaml" ]; then
  echo "  ❌ ERROR: app.yaml not found"
  ERRORS=$((ERRORS + 1))
else
  echo "  ✓ app.yaml exists"
  
  # Check for critical configuration
  if grep -q "dockerfile_path" app.yaml; then
    echo "  ✓ app.yaml contains dockerfile_path configuration"
  else
    echo "  ❌ ERROR: app.yaml missing dockerfile_path"
    ERRORS=$((ERRORS + 1))
  fi
fi

# Check 5: Verify backend dependencies
echo ""
echo "✓ Checking backend dependencies..."
if [ ! -f "backend/package.json" ]; then
  echo "  ❌ ERROR: backend/package.json not found"
  ERRORS=$((ERRORS + 1))
else
  echo "  ✓ backend/package.json exists"
  
  # Check for required packages
  if grep -q "express" backend/package.json; then
    echo "  ✓ Express.js dependency found"
  else
    echo "  ❌ ERROR: Express.js not in dependencies"
    ERRORS=$((ERRORS + 1))
  fi
  
  if grep -q "mongoose" backend/package.json; then
    echo "  ✓ Mongoose dependency found"
  else
    echo "  ❌ ERROR: Mongoose not in dependencies"
    ERRORS=$((ERRORS + 1))
  fi
fi

# Check 6: Verify frontend dependencies
echo ""
echo "✓ Checking frontend dependencies..."
if [ ! -f "frontend/package.json" ]; then
  echo "  ❌ ERROR: frontend/package.json not found"
  ERRORS=$((ERRORS + 1))
else
  echo "  ✓ frontend/package.json exists"
  
  if grep -q "@angular" frontend/package.json; then
    echo "  ✓ Angular dependency found"
  else
    echo "  ❌ ERROR: Angular not in dependencies"
    ERRORS=$((ERRORS + 1))
  fi
fi

# Check 7: Verify environment configuration
echo ""
echo "✓ Checking environment configuration..."
if [ -f "backend/.env" ]; then
  echo "  ✓ backend/.env exists"
  
  if grep -q "MONGODB_URI" backend/.env; then
    echo "  ✓ MONGODB_URI configured in backend/.env"
  else
    echo "  ⚠️  WARNING: MONGODB_URI not found in backend/.env"
  fi
  
  if grep -q "JWT_SECRET" backend/.env; then
    echo "  ✓ JWT_SECRET configured in backend/.env"
  else
    echo "  ⚠️  WARNING: JWT_SECRET not found in backend/.env"
  fi
else
  echo "  ⚠️  WARNING: backend/.env not found (OK for production - uses app.yaml)"
fi

# Check 8: Verify git repository
echo ""
echo "✓ Checking git configuration..."
if [ -d ".git" ]; then
  echo "  ✓ Git repository initialized"
  
  REMOTE=$(git remote get-url origin 2>/dev/null)
  if [ -n "$REMOTE" ]; then
    echo "  ✓ Git remote configured: $REMOTE"
  else
    echo "  ❌ ERROR: No git remote configured"
    echo "     Run: git remote add origin <your-repo-url>"
    ERRORS=$((ERRORS + 1))
  fi
  
  BRANCH=$(git branch --show-current 2>/dev/null)
  if [ -n "$BRANCH" ]; then
    echo "  ✓ Current branch: $BRANCH"
  fi
else
  echo "  ❌ ERROR: Not a git repository"
  ERRORS=$((ERRORS + 1))
fi

# Summary
echo ""
echo "======================================"
echo "Validation Summary"
echo "======================================"
if [ $ERRORS -eq 0 ]; then
  echo "✅ All critical checks passed!"
  echo ""
  echo "Your repository is ready for Digital Ocean deployment."
  echo ""
  echo "Next steps:"
  echo "  1. Commit and push your changes: git add . && git commit -m 'Fix deployment configuration' && git push"
  echo "  2. Go to Digital Ocean App Platform: https://cloud.digitalocean.com/apps"
  echo "  3. Create new app from GitHub repository"
  echo "  4. Use app.yaml specification"
  echo ""
  exit 0
else
  echo "❌ Found $ERRORS critical error(s)"
  echo ""
  echo "Please fix the errors above before deploying."
  echo ""
  exit 1
fi
