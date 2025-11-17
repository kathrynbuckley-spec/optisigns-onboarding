# Deploy to Digital Ocean - Simple Guide

This repository is configured for **automatic deployment** to Digital Ocean App Platform using Dockerfiles.

## Prerequisites
- Digital Ocean account
- GitHub repository connected to Digital Ocean

## Deployment Steps

### Option 1: Automatic (Recommended)

1. **Go to Digital Ocean Dashboard** → Apps → **Create App**

2. **Select GitHub** as source
   - Authorize Digital Ocean to access GitHub
   - Select repository: `kathrynbuckley-spec/optisigns-onboarding`
   - Select branch: `main`
   - Click **Next**

3. **Digital Ocean should auto-detect TWO components:**
   - ✅ `backend` - Dockerfile-based service
   - ✅ `frontend` - Dockerfile-based service

   **If you only see ONE component or "Buildpack" is selected:**
   - Click "Edit App Spec" button
   - Copy contents from `app.yaml` in this repository
   - Paste into the App Spec editor
   - Click "Save"

4. **Review Configuration**
   - Verify both components show "Dockerfile" as build method
   - Verify environment variables are present (MONGODB_URI, JWT_SECRET, etc.)
   - Click **Next**

5. **Review Plan** (should be ~$10/month for 2x basic-xxs)
   - Click **Create Resources**

6. **Wait for Deployment** (~5-10 minutes)
   - Monitor build logs
   - Once deployed, you'll get two URLs:
     - Backend API: `https://backend-xxxxx.ondigitalocean.app`
     - Frontend: `https://frontend-xxxxx.ondigitalocean.app`

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
- The root `package.json` file may be interfering
- Ensure `package.json` is renamed to `package.json.dev`
- Manually edit App Spec to specify Dockerfiles

### Environment variables not loading
- Check that App Spec includes all `envs:` sections
- Verify MongoDB URI is correct and cluster is accessible
- Check Digital Ocean → App → Settings → Environment Variables

### Health checks failing
- Backend must start on port 8080 (configured in app.yaml)
- MongoDB connection must succeed before health check
- Initial delay is 30 seconds to allow connection time

### Build fails
- Check Digital Ocean build logs
- Verify Dockerfiles exist in `backend/` and `frontend/` directories
- Ensure `.dockerignore` excludes `.env` files

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
