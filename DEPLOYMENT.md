# Deployment Guide - Digital Ocean App Platform

This guide will walk you through deploying the OptiSigns Onboarding application to Digital Ocean App Platform.

## Repository Structure

This is a monorepo containing both frontend and backend applications:

```
optisigns-onboarding/
├── package.json          # Root package with workspace scripts
├── frontend/             # Angular application
│   ├── package.json
│   └── src/
├── backend/              # Express API
│   ├── package.json
│   └── server.js
└── .do/
    └── app.yaml          # Digital Ocean App Spec
```

## Prerequisites

1. **Digital Ocean Account** - Sign up at https://www.digitalocean.com/
2. **GitHub Account** - Your code needs to be in a GitHub repository
3. **MongoDB Atlas** - Already configured ✅

## Cost Estimate

- **Backend App**: $5/month (Basic plan)
- **Frontend App**: $5/month (Basic plan)
- **MongoDB Atlas**: Free (M0 tier)
- **Total**: ~$10/month

## Deployment Steps

### Step 1: Push Code to GitHub

```bash
# If you haven't already, create a GitHub repository
# Then push your code:

cd /Users/buckley/optisigns-onboarding

# Add remote (replace with your GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/optisigns-onboarding.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Digital Ocean (Using App Spec)

**Recommended Method**: Use the included App Spec file (`.do/app.yaml`)

1. **Go to Digital Ocean Dashboard**
   - Navigate to: https://cloud.digitalocean.com/apps

2. **Create New App**
   - Click "Create" → "Apps"
   - Choose "GitHub" as source
   - Authorize Digital Ocean to access your GitHub
   - Select your `optisigns-onboarding` repository
   - Select the `main` branch

3. **Import App Spec**
   - Look for "Edit App Spec" or "Use existing spec"
   - Upload or paste the contents of `.do/app.yaml`
   - Digital Ocean will automatically configure both services:
     - **Backend**: Source directory `backend/`, builds and runs the Express API
     - **Frontend**: Source directory `frontend/`, builds and serves the Angular app

4. **Review Configuration**
   - Verify both services are detected
   - Check that environment variables are set (they're in the app.yaml)
   - Backend will be at: `https://backend-{app-name}.ondigitalocean.app`
   - Frontend will be at: `https://frontend-{app-name}.ondigitalocean.app`

5. **Update Sensitive Environment Variables**
   - Go to Settings → Environment Variables
   - Update the JWT_SECRET with a secure value (see Step 3)
   - Update MONGODB_URI if needed

6. **Deploy**
   - Click "Create Resources"
   - Wait for deployment (takes 3-5 minutes)
   - Both frontend and backend will deploy simultaneously

### Step 3: Generate Secure JWT Secret

Run this command locally to generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Then update the `JWT_SECRET` environment variable in Digital Ocean settings.

### Step 4: Configure MongoDB Atlas Network Access

1. **Go to MongoDB Atlas Dashboard**
2. **Click "Network Access"** in left sidebar
3. **Click "Add IP Address"**
4. **Choose "Allow Access From Anywhere"** (0.0.0.0/0)
   - Or add specific Digital Ocean IP ranges for better security
5. **Click "Confirm"**

### Step 5: Test Your Deployment

Visit your frontend URL and test:
- User registration
- Login
- Questionnaire submission
- Admin dashboard

## Local Development

The repository includes helpful npm scripts for local development:

```bash
# Install all dependencies (root, frontend, backend)
npm run install:all

# Run both frontend and backend in development mode
npm run dev

# Run backend only (with nodemon for auto-reload)
npm run dev:backend

# Run frontend only
npm run dev:frontend

# Build for production
npm run build

# Seed the database with test data
npm run seed
```

## Manual Deployment (Alternative)

If you prefer to configure each service manually instead of using the app spec:

1. Create two separate apps in Digital Ocean
2. For Backend:
   - Source Directory: `backend`
   - Build Command: `npm install --production`
   - Run Command: `npm start`
   - Port: 8080
3. For Frontend:
   - Source Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Run Command: `npx http-server dist/frontend/browser -p 8080 -c-1`
   - Port: 8080

## Troubleshooting

### Backend Won't Start
- Check environment variables are set correctly
- Verify MongoDB connection string
- Check logs in Digital Ocean dashboard

### Frontend Can't Connect to Backend
- Verify API_URL environment variable
- Check CORS_ORIGIN in backend
- Ensure both apps are deployed and running

### MongoDB Connection Failed
- Check Network Access in MongoDB Atlas
- Verify connection string is correct
- Ensure IP whitelist allows Digital Ocean

### 404 Errors on Frontend Routes
- Check that http-server is serving correctly
- May need to add URL rewrite rules for Angular routing

## Production Optimizations

### Security
1. Generate strong JWT_SECRET:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. Use Digital Ocean Secrets for sensitive data

3. Enable HTTPS (automatic with Digital Ocean)

4. Restrict MongoDB IP access to specific ranges

### Performance
1. Enable CDN in Digital Ocean
2. Add caching headers
3. Compress assets
4. Use environment-specific builds

### Monitoring
1. Enable Digital Ocean monitoring
2. Set up alerts for downtime
3. Monitor MongoDB Atlas metrics
4. Add logging service (Papertrail, etc.)

## Custom Domain (Optional)

1. **Buy domain** (e.g., from Namecheap, GoDaddy)
2. **Add to Digital Ocean**:
   - Go to app settings → Domains
   - Add your custom domain
   - Update DNS records as instructed
3. **SSL Certificate**: Automatically provisioned

## Cost Optimization

- **Development**: Use $5 plans
- **Production**: Scale up as needed
- **Free Tier**: Keep MongoDB on Atlas free tier (M0)
- **Pause Apps**: Can pause during development to save costs

## Continuous Deployment

Digital Ocean automatically redeploys when you push to GitHub:
```bash
git add .
git commit -m "Update feature"
git push origin main
# Digital Ocean will automatically rebuild and deploy
```

## Rollback

If deployment fails:
1. Go to app dashboard
2. Click "Deployments" tab
3. Select previous successful deployment
4. Click "Redeploy"

---

**Need Help?**
- Digital Ocean Docs: https://docs.digitalocean.com/products/app-platform/
- Community: https://www.digitalocean.com/community/
