# Deployment Guide for JobDate

## Deploy to Vercel

Since you're encountering build issues locally with the Sharp library, follow these steps to deploy directly to Vercel:

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Updated codebase with job scraper and cron job"
   git push
   ```

2. **Deploy using Vercel CLI** (Optional, you can also deploy via the Vercel dashboard):
   ```bash
   # Install Vercel CLI if you haven't already
   npm install -g vercel

   # Deploy
   vercel
   ```

3. **Deploy via Vercel Dashboard**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Keep the default build settings
   - Add the following environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL` (your Supabase URL)
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (your Supabase anonymous key)
   - Click "Deploy"

## Enable Cron Job

After deploying your application to Vercel:

1. Navigate to your project in the Vercel dashboard
2. Go to Settings → Cron Jobs
3. You should see the scraper job listed (app/api/cron/scrape)
4. Toggle it to enable it
5. Vercel will run it automatically at midnight ICT (5pm UTC) every day

## Testing Your API

You can manually test your scraper API endpoint:

```bash
curl https://your-project-name.vercel.app/api/cron/scrape
```

## Troubleshooting

If you encounter issues:

1. **Check the logs** in the Vercel dashboard
2. **Verify environment variables** are correctly set
3. **Check Function Logs** after manually triggering the cron job
4. **Consider image optimization issues**:
   - We've set `unoptimized: true` in your next.config.js
   - Vercel should handle Sharp dependency automatically in its build environment

Remember, the free tier of Vercel has limitations:
- Function runtime is limited to 30 seconds
- Limited memory and compute resources
- Consider implementing a queue system for production

Let me know if you need help with any specific part of the deployment! 