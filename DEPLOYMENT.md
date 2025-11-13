# Deployment Guide - Digital Ocean App Platform

This guide will walk you through deploying the OptiSigns Onboarding application to Digital Ocean App Platform.

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

### Step 2: Deploy Backend to Digital Ocean

1. **Go to Digital Ocean Dashboard**
   - Navigate to: https://cloud.digitalocean.com/apps

2. **Create New App**
   - Click "Create" → "Apps"
   - Choose "GitHub" as source
   - Authorize Digital Ocean to access your GitHub
   - Select your `optisigns-onboarding` repository

3. **Configure Backend**
   - **Source Directory**: `/backend`
   - **Build Command**: `npm install`
   - **Run Command**: `npm start`
   - **HTTP Port**: `8080` (Digital Ocean uses 8080)
   - **Environment Variables**: Click "Edit" and add:
     ```
     PORT=8080
     NODE_ENV=production
     JWT_SECRET=<generate-a-secure-random-string>
     JWT_EXPIRES_IN=7d
     MONGODB_URI=mongodb+srv://kathrynbuckley_db_user:KKwx8mSwKDXTKmSL@cluster0.f7fzwx8.mongodb.net/optisigns-onboarding?retryWrites=true&w=majority&appName=Cluster0
     CORS_ORIGIN=<will-be-frontend-url>
     ```

4. **Choose Plan**
   - Select "Basic" plan ($5/month)
   - 512 MB RAM / 1 vCPU

5. **Name Your App**
   - Name: `optisigns-backend`

6. **Click "Create Resources"**
   - Wait for deployment (takes 3-5 minutes)
   - Note the backend URL (e.g., `https://optisigns-backend-xxxxx.ondigitalocean.app`)

### Step 3: Update Backend CORS Settings

1. **Go to your backend app settings**
2. **Edit Environment Variables**
3. **Update `CORS_ORIGIN`** with your frontend URL (will get this in next step)

### Step 4: Deploy Frontend to Digital Ocean

1. **Create Another App**
   - Click "Create" → "Apps"
   - Select same GitHub repository

2. **Configure Frontend**
   - **Source Directory**: `/frontend`
   - **Build Command**: `npm install && npm run build`
   - **Run Command**: `npx http-server dist/frontend/browser -p 8080`
   - **HTTP Port**: `8080`
   - **Environment Variables**: Add:
     ```
     API_URL=<your-backend-url>/api
     ```
     (e.g., `https://optisigns-backend-xxxxx.ondigitalocean.app/api`)

3. **Add http-server Dependency**
   - We need to add http-server to package.json first

4. **Choose Plan**
   - Select "Basic" plan ($5/month)

5. **Name Your App**
   - Name: `optisigns-frontend`

6. **Click "Create Resources"**
   - Note the frontend URL (e.g., `https://optisigns-frontend-xxxxx.ondigitalocean.app`)

### Step 5: Update Backend CORS

1. Go back to backend app settings
2. Edit `CORS_ORIGIN` environment variable
3. Set it to your frontend URL: `https://optisigns-frontend-xxxxx.ondigitalocean.app`
4. Save and redeploy

### Step 6: Configure MongoDB Atlas Network Access

1. **Go to MongoDB Atlas Dashboard**
2. **Click "Network Access"** in left sidebar
3. **Click "Add IP Address"**
4. **Choose "Allow Access From Anywhere"** (0.0.0.0/0)
   - Or add specific Digital Ocean IP ranges for better security
5. **Click "Confirm"**

### Step 7: Test Your Deployment

Visit your frontend URL and test:
- User registration
- Login
- Questionnaire submission
- Admin dashboard

## Alternative: Deploy Both Apps Together (Monorepo)

Digital Ocean can deploy both frontend and backend from the same repository as separate components.

### Create App Spec File

See `.do/app.yaml` in your repository for the complete configuration.

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
