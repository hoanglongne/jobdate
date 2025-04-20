# Deployment Guide: Bypassing Local Build Issues

Since you're experiencing segmentation faults (`SIGSEGV`) during local builds, here's how to deploy directly to Vercel without building locally:

## Deploy Directly to Vercel

### Option 1: Using the Vercel Dashboard (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Updated project with job scraper and configuration"
   git push
   ```

2. **Import your project in Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will detect your Next.js project automatically
   - Keep all default settings
   - Deploy!

### Option 2: Using Vercel CLI

1. **Deploy using Vercel CLI**
   ```bash
   vercel --prod
   ```

## Why This Works

The segmentation fault you're experiencing locally is likely due to:
1. Node.js version compatibility issues with Sharp
2. Memory allocation problems during build
3. Conflicts between native modules

Vercel's build environment:
- Uses consistent Node.js versions
- Has optimized build pipelines
- Properly handles image optimization

## Verifying Your Cron Job

After deployment:

1. **Check your cron job in the Vercel dashboard**
   - Go to your project
   - Navigate to Settings → Cron Jobs
   - Verify that your job is listed

2. **Manually test the endpoint**
   ```bash
   curl https://your-app-name.vercel.app/api/cron/scrape
   ```

## Troubleshooting Failed Builds on Vercel

If your build fails on Vercel:

1. **Check if you need to upgrade your plan**
   - Free plans have limited build resources
   - Consider upgrading if you need more resources

2. **Check your environment variables**
   - Ensure NEXT_PUBLIC_SUPABASE_URL is set
   - Ensure NEXT_PUBLIC_SUPABASE_ANON_KEY is set

3. **Review build logs**
   - Look for specific errors in the Vercel logs
   - They're usually more detailed than local errors 