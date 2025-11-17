# Digital Ocean Deployment Instructions

## Step 1: Get Latest App Spec from GitHub

1. Go to: https://raw.githubusercontent.com/kathrynbuckley-spec/optisigns-onboarding/main/app.yaml
2. Copy the ENTIRE contents (Ctrl+A, Ctrl+C or Cmd+A, Cmd+C)

## Step 2: Update Digital Ocean App Spec

1. Go to Digital Ocean Dashboard: https://cloud.digitalocean.com/apps
2. Click on your `optisigns-onboarding` app
3. Click **Settings** tab (left sidebar)
4. Click **App Spec** 
5. Click **Edit** button
6. **DELETE everything** in the editor
7. **PASTE** the content from Step 1
8. Click **Save**

## Step 3: Deploy

1. Go to **Deployments** tab
2. Click **Create Deployment** button
3. Wait for build to complete (~10-15 minutes)

## Troubleshooting

If deployment still fails:
- Verify the app spec in Digital Ocean matches exactly what's in GitHub
- Check that it says `branch: main` (not a specific commit)
- Ensure both services have `dockerfile_path: Dockerfile`

## Current App Spec (Latest)

Location: https://github.com/kathrynbuckley-spec/optisigns-onboarding/blob/main/app.yaml

This is the source of truth - always use this file.
