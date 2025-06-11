# 🚀 Complete Google Cloud Platform Deployment Guide

## Overview

This guide will walk you through deploying your HRIS application (Laravel backend + Next.js frontend) to Google Cloud Platform using Cloud Run and Cloud SQL.

## ⚠️ Important Prerequisites

### 1. Install Required Tools

1. **Google Cloud CLI**: Download from https://cloud.google.com/sdk/docs/install
2. **Docker Desktop**: Download from https://www.docker.com/products/docker-desktop
3. **Git**: Ensure Git is installed and your code is in a repository

### 2. Google Cloud Setup

1. Go to https://console.cloud.google.com/
2. Create a new project or select existing project
3. Enable billing (required even for free tier)
4. Note your PROJECT_ID (you'll need this multiple times)

## 📋 Step-by-Step Deployment Process

### Step 1: Prepare Your Repository

#### 1.1 Push to GitHub (if not already done)

```cmd
cd "d:\Software\laragon\www\hris-cmlabs"
git add .
git commit -m "Prepare for Google Cloud deployment"
git push origin main
```

#### 1.2 Generate Laravel App Key for Production

```cmd
cd "d:\Software\laragon\www\hris-cmlabs\backend"
php artisan key:generate --show
```

**IMPORTANT**: Copy this key and save it - you'll need it later!

### Step 2: Set Up Google Cloud Project

#### 2.1 Install and Initialize Google Cloud CLI

```cmd
gcloud init
```

Follow the prompts to:

- Login to your Google account
- Select or create a project
- Set default region (recommend: `asia-southeast2` for Indonesia)

#### 2.2 Enable Required APIs

```cmd
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### Step 3: Set Up Cloud SQL Database

#### 3.1 Create Cloud SQL Instance

```cmd
gcloud sql instances create hris-db-instance ^
    --database-version=MYSQL_8_0 ^
    --tier=db-f1-micro ^
    --region=asia-southeast2 ^
    --storage-type=SSD ^
    --storage-size=10GB ^
    --backup ^
    --enable-bin-log
```

#### 3.2 Create Database

```cmd
gcloud sql databases create hris_production --instance=hris-db-instance
```

#### 3.3 Create Database User

```cmd
gcloud sql users create hris_user ^
    --instance=hris-db-instance ^
    --password=YOUR_SECURE_PASSWORD_HERE
```

#### 3.4 Get Database Connection Details

```cmd
gcloud sql instances describe hris-db-instance
```

**IMPORTANT**: Note the `ipAddresses` -> `ipAddress` value (this is your DB_HOST)

### Step 4: Configure Environment Variables

#### 4.1 Update Backend Environment

Edit `backend\.env.production` with your actual values:

```env
APP_KEY=base64:YOUR_GENERATED_APP_KEY_FROM_STEP_1.2
DB_HOST=YOUR_CLOUD_SQL_IP_FROM_STEP_3.4
DB_USERNAME=hris_user
DB_PASSWORD=YOUR_SECURE_PASSWORD_FROM_STEP_3.3
```

### Step 5: Deploy to Google Cloud

#### 5.1 Set Environment Variables

```cmd
set PROJECT_ID=your-actual-project-id
gcloud config set project %PROJECT_ID%
```

#### 5.2 Build and Deploy Using Cloud Build

```cmd
cd "d:\Software\laragon\www\hris-cmlabs"
gcloud builds submit --config=cloudbuild.yaml
```

**This process will take 10-15 minutes. It will:**

- Build Docker images for both frontend and backend
- Push images to Google Container Registry
- Deploy both services to Cloud Run
- Provide you with public URLs

#### 5.3 Get Your Deployment URLs

```cmd
gcloud run services list --platform=managed --region=asia-southeast2
```

### Step 6: Configure Database and Final Setup

#### 6.1 Run Database Migrations

Once backend is deployed, get the backend URL and run:

```cmd
gcloud run services proxy hris-backend --port=8080 --region=asia-southeast2
```

In another terminal:

```cmd
curl -X POST http://localhost:8080/api/migrate
```

#### 6.2 Seed Initial Data

```cmd
curl -X POST http://localhost:8080/api/seed
```

### Step 7: Update Environment Variables with Real URLs

#### 7.1 Update Frontend Environment

Edit `frontend\.env.production`:

```env
NEXT_PUBLIC_API_URL=https://your-actual-backend-url.a.run.app/api
NEXT_PUBLIC_FRONTEND_URL=https://your-actual-frontend-url.a.run.app
```

#### 7.2 Update Backend Environment

Edit `backend\.env.production`:

```env
FRONTEND_URL=https://your-actual-frontend-url.a.run.app
APP_URL=https://your-actual-backend-url.a.run.app
```

#### 7.3 Redeploy with Updated URLs

```cmd
gcloud builds submit --config=cloudbuild.yaml
```

## 🔧 Configuration Checklist

### Before Deployment

- [ ] Generated Laravel APP_KEY
- [ ] Created Google Cloud project
- [ ] Enabled required APIs
- [ ] Created Cloud SQL instance and database
- [ ] Updated environment files with correct values

### After Deployment

- [ ] Both services show as "READY" in Cloud Run
- [ ] Database migrations completed successfully
- [ ] Initial data seeded
- [ ] Frontend can connect to backend
- [ ] Authentication system works
- [ ] All features functional

## 🚨 Common Issues and Solutions

### Issue 1: Build Timeout

**Solution**: Increase build timeout:

```cmd
gcloud config set builds/timeout 3600
```

### Issue 2: Database Connection Errors

**Solution**:

1. Check your Cloud SQL IP whitelist
2. Verify database credentials
3. Ensure Cloud SQL instance is running

### Issue 3: CORS Errors

**Solution**: Update `backend/config/cors.php`:

```php
'allowed_origins' => [
    env('FRONTEND_URL', 'http://localhost:3000'),
],
```

### Issue 4: Memory Errors

**Solution**: Increase memory allocation in cloudbuild.yaml:

```yaml
- '--memory'
- '2Gi'
```

## 💰 Cost Estimation

### Free Tier Usage (Monthly):

- Cloud Run: 2 million requests free
- Cloud SQL: db-f1-micro free for 120 hours
- Storage: 5GB free
- Build: 120 build-minutes free

### Expected Monthly Cost (After free tier):

- Cloud Run: $0-10 (depending on traffic)
- Cloud SQL: $7-15 (for db-f1-micro)
- Total: $7-25/month for small to medium usage

## 🔒 Security Recommendations

1. **Enable Cloud IAM**: Set up proper user access controls
2. **Use Secrets Manager**: Store sensitive data in Google Secret Manager
3. **Enable HTTPS**: All Cloud Run services use HTTPS by default
4. **Database Security**: Enable Cloud SQL Auth Proxy for production
5. **Environment Variables**: Never commit real credentials to repository

## 📞 Support and Monitoring

### Monitoring Your Application

```cmd
# View logs
gcloud logs read "resource.type=cloud_run_revision"

# Monitor performance
gcloud run services describe hris-backend --region=asia-southeast2
```

### Scaling Your Application

```cmd
# Update scaling settings
gcloud run services update hris-backend ^
    --min-instances=1 ^
    --max-instances=100 ^
    --region=asia-southeast2
```

## ✅ Final Verification

After deployment, verify these URLs work:

1. Frontend: `https://your-frontend-url.a.run.app`
2. Backend API: `https://your-backend-url.a.run.app/api/health`
3. Authentication: Login flow works end-to-end
4. Features: All HRIS features function correctly

## 🎉 Congratulations!

Your HRIS application is now live on Google Cloud Platform with:

- ✅ Scalable serverless architecture
- ✅ Managed database with automatic backups
- ✅ Global CDN and HTTPS
- ✅ Monitoring and logging
- ✅ Cost-effective pay-per-use pricing

---

**Need Help?**

- Google Cloud Documentation: https://cloud.google.com/docs
- Cloud Run Documentation: https://cloud.google.com/run/docs
- Laravel Deployment: https://laravel.com/docs/deployment
