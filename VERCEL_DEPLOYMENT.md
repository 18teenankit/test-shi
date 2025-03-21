# Vercel Deployment Guide

This guide explains how to deploy your Shivanshi Enterprises web application to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. Git repository with your application code
3. Cloud PostgreSQL database (already configured)

## Deployment Steps

### 1. Push Your Code to a Git Repository

Make sure all the code changes including Vercel-specific configuration files are pushed to your repository:
- vercel.json
- api/index.ts
- build-vercel.js
- tsconfig.server.json
- .vercelignore

### 2. Add Environment Variables in Vercel

When setting up your project in Vercel, you need to add the following environment variables:

- `DATABASE_URL`: Your cloud PostgreSQL connection string
  ```
  postgres://ankittgiri:Ankit@8511@postgresql-194487-0.cloudclusters.net:10138/my_shivi_db
  ```
- `NODE_ENV`: Set to `production`

### 3. Deploy to Vercel

1. Log in to your Vercel account
2. Click "Add New" > "Project"
3. Import your Git repository
4. Configure the project:
   - Framework Preset: Other
   - Build Command: `npm run vercel-build`
   - Output Directory: `dist/client`
   - Install Command: `npm install`
5. Add the environment variables in the "Environment Variables" section
6. Click "Deploy"

### 4. Troubleshooting

If you encounter issues after deployment:

1. **404 Not Found errors**: 
   - Check that the routing in vercel.json is correct
   - Verify that api/index.ts is properly exporting your Express app

2. **Database connection errors**:
   - Verify that the `DATABASE_URL` environment variable is correctly set in Vercel
   - Check that your cloud database is accessible from Vercel's servers (no firewall restrictions)

3. **Build errors**:
   - Check the Vercel deployment logs
   - Ensure all required dependencies are properly listed in package.json

### 5. Custom Domain (Optional)

1. Go to your Vercel project settings
2. Click on "Domains"
3. Add your custom domain and follow the verification steps

## Maintenance

### Updating Your Deployment

Any push to the main branch of your repository will trigger a new deployment on Vercel.

### Checking Logs

You can view logs for your application in the Vercel dashboard under the "Logs" section of your project.

### Monitoring

Vercel provides basic analytics for your application. For more advanced monitoring, consider integrating with a service like New Relic or Datadog. 