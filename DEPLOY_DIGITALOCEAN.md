# Deploy to Digital Ocean - Complete Guide

This repository is configured for **automatic deployment** to Digital Ocean App Platform using Dockerfiles.

## Prerequisites
- Digital Ocean account
- GitHub repository connected to Digital Ocean
- All changes committed and pushed to GitHub

## Pre-Deployment Validation

**Before deploying, run the validation script to ensure your repository is properly configured:**

```bash
./validate-deployment.sh
```

This script will verify:
- ✅ Root package.json is renamed (to avoid buildpack detection)
- ✅ Both Dockerfiles exist and are properly configured
- ✅ .dockerignore files are present
- ✅ app.yaml is correctly configured
- ✅ All dependencies are properly defined
- ✅ Git remote is configured

**The validation script must pass before proceeding with deployment!**

## Deployment Steps

### Option 1: Web Console (Recommended)

1. **Ensure all changes are committed and pushed to GitHub**
   ```bash
   git add .
   git commit -m "Fix deployment configuration for Digital Ocean"
   git push origin main
   ```

2. **Go to Digital Ocean Dashboard** → Apps → **Create App**
   - URL: https://cloud.digitalocean.com/apps

3. **Select GitHub** as source
   - Authorize Digital Ocean to access GitHub
   - Select repository: `kathrynbuckley-spec/optisigns-onboarding`
   - Select branch: `main`
   - **IMPORTANT**: Check "Autodeploy" to enable automatic deployments on push
   - Click **Next**

4. **Configure Resources - CRITICAL STEP**

   Digital Ocean should auto-detect TWO services:
   - ✅ `backend` - Web Service (Dockerfile)
   - ✅ `frontend` - Web Service (Dockerfile)

   **⚠️ If you see "Buildpack" or only ONE service:**
   - Click **"Edit App Spec"** button at the bottom
   - Delete all content in the editor
   - Copy the entire contents from `app.yaml` in this repository
   - Paste into the App Spec editor
   - Click **"Save"**
   - This will override auto-detection and use your exact configuration

5. **Review Configuration**
   - Verify BOTH services show **"Dockerfile"** as build method
   - Verify environment variables are present:
     - Backend: `NODE_ENV`, `PORT`, `JWT_SECRET`, `MONGODB_URI`, `CORS_ORIGIN`
     - Frontend: `API_URL`
   - Verify health check is configured for backend (`/api/health`)
   - Click **Next**

6. **Review Info & Billing**
   - App name: `optisigns-onboarding`
   - Region: `NYC` (or your preferred region)
   - Estimated cost: **~$10-12/month** (2x basic-xxs instances)
   - Click **"Create Resources"**

7. **Wait for Initial Deployment** (~8-12 minutes)
   - Monitor build logs for both services
   - Backend should show: "Server running in production mode on port 8080"
   - Frontend should show: "Starting HTTP server on port 8080"

   **Once deployed successfully, you'll get:**
   - Frontend URL: `https://optisigns-onboarding-xxxxx.ondigitalocean.app` (main app)
   - Backend URL: `https://optisigns-onboarding-backend-xxxxx.ondigitalocean.app` (API)

8. **Verify Deployment**
   - Visit the frontend URL - you should see the login page
   - Check backend health: `https://[backend-url]/api/health` should return JSON with `success: true`

### Option 2: Using doctl CLI

```bash
# Install doctl if needed
brew install doctl

# Authenticate
doctl auth init

# Create app from spec
doctl apps create --spec app.yaml

# Monitor deployment
doctl apps list
```

## Architecture

- **Backend**: Node.js/Express API on port 8080
  - MongoDB Atlas connection
  - JWT authentication
  - Health check: `/api/health`

- **Frontend**: Angular 17 SPA on port 8080
  - Served via http-server
  - API URL injected at runtime

## Environment Variables

All environment variables are pre-configured in `app.yaml`:
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - JWT signing secret
- `NODE_ENV` - Set to production
- `PORT` - Set to 8080
- `CORS_ORIGIN` - Frontend URL (auto-configured)
- `API_URL` - Backend URL (auto-configured for frontend)

## Troubleshooting

### "Buildpack" is selected instead of "Dockerfile"
**Symptom:** Digital Ocean shows "Node.js" or "Static Site" buildpack instead of Dockerfile

**Solution:**
1. Verify root `package.json` is renamed to `package.json.dev` (run `./validate-deployment.sh`)
2. Click **"Edit App Spec"** button
3. Copy entire contents from `app.yaml` file
4. Paste into App Spec editor, replacing all content
5. Click **"Save"**

### Build Fails - "Dockerfile not found"
**Symptom:** Build error saying "Dockerfile not found in /workspace"

**Solution:**
- Verify `app.yaml` has correct paths:
  - `source_dir: /backend` and `dockerfile_path: /backend/Dockerfile`
  - `source_dir: /frontend` and `dockerfile_path: /frontend/Dockerfile`
- Ensure Dockerfiles exist in correct locations (run `./validate-deployment.sh`)
- Push changes to GitHub and trigger rebuild

### Health Checks Failing
**Symptom:** Backend service shows as unhealthy

**Possible Causes:**
1. **MongoDB connection failed**
   - Verify `MONGODB_URI` in app.yaml is correct
   - Ensure MongoDB Atlas allows connections from any IP (0.0.0.0/0)
   - Check Digital Ocean → App → Runtime Logs for connection errors

2. **Port mismatch**
   - Backend must listen on port 8080 (check `backend/server.js`)
   - Verify `app.yaml` has `http_port: 8080`

3. **Initial delay too short**
   - MongoDB connection takes time
   - `app.yaml` sets `initial_delay_seconds: 40` to allow connection
   - Wait 1-2 minutes after deployment starts

### Frontend Shows "Cannot connect to backend"
**Symptom:** Frontend loads but API calls fail

**Solution:**
1. Check browser console for CORS errors
2. Verify backend CORS configuration allows Digital Ocean URLs (✅ already configured)
3. Check `window.API_URL` in browser console - should be backend URL
4. Verify environment variables in Digital Ocean:
   - Frontend `API_URL` = `${backend.PUBLIC_URL}/api`
   - Backend `CORS_ORIGIN` = `${frontend.PUBLIC_URL}`

### Build Succeeds but App Crashes
**Symptom:** Build completes but app immediately crashes

**Solution:**
1. Check Runtime Logs in Digital Ocean dashboard
2. Common issues:
   - Missing environment variables
   - MongoDB connection timeout
   - Port configuration mismatch
3. Verify all required env vars are set in app.yaml

### Environment Variables Not Loading
**Symptom:** App can't find MongoDB, JWT_SECRET, etc.

**Solution:**
1. Verify `app.yaml` has all `envs:` sections with correct values
2. Check Digital Ocean → App → Settings → Environment Variables
3. After changing env vars, trigger manual redeploy

## Local Development

For local development, use:

```bash
# Start both backend and frontend
./dev.sh

# Or manually:
cd backend && npm run dev    # Port 3000
cd frontend && npm start     # Port 4200
```

## Support

- Digital Ocean Docs: https://docs.digitalocean.com/products/app-platform/
- GitHub Issues: https://github.com/kathrynbuckley-spec/optisigns-onboarding/issues
