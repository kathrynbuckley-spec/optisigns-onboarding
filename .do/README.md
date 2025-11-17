# Digital Ocean Deployment Configuration

This directory contains the App Platform specification for deploying this application.

## app.yaml

This file defines TWO Docker-based services:
- **backend**: Node.js Express API (port 8080)
- **frontend**: Angular 17 SPA (port 8080)

Both services use Dockerfiles located in their respective directories:
- `backend/Dockerfile`
- `frontend/Dockerfile`

## How Digital Ocean Uses This

When you connect this repository to Digital Ocean App Platform:
1. Digital Ocean detects the root `package.json` (for initial detection)
2. Digital Ocean finds `.do/app.yaml` or `app.yaml`
3. Digital Ocean reads the spec and creates TWO components
4. Each component is built using its Dockerfile
5. Environment variables from app.yaml are injected

## Important

Do NOT use the root package.json for deployment. It's only for local development.
The app.yaml configuration overrides any buildpack detection.
