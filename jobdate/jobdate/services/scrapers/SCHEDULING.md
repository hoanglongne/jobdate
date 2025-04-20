# Scheduling the Job Scraper

This guide provides options for running the job scraper on a schedule.

## Option 1: Vercel Cron Jobs (Recommended)

Vercel provides built-in cron jobs that can execute on a schedule. This is the easiest method if you're already hosting on Vercel.

### Setup:

1. We've created an API route at `app/api/cron/scrape/route.ts` that runs the scraper.
2. The cron job is configured to run at midnight ICT (5pm UTC) every day.
3. The configuration is already set in the file:

```typescript
export const config = {
  runtime: 'edge',
  cron: '0 17 * * *' // Run at midnight ICT (UTC+7) -> 17:00 UTC
};
```

### Deployment:

1. Just deploy your application to Vercel:
```bash
vercel deploy
```

2. Enable the Cron Job in your Vercel dashboard:
   - Go to your project in the Vercel dashboard
   - Navigate to Settings > Cron Jobs
   - Ensure the cron job is enabled

### Testing:

You can manually trigger the cron job to test it:
```bash
curl https://your-vercel-app.vercel.app/api/cron/scrape
```

## Option 2: Supabase Edge Functions

Supabase allows you to deploy Edge Functions with scheduled execution.

### Setup:

1. We've created an Edge Function at `supabase/functions/scrape-jobs/index.ts`.
2. Deploy the function:
```bash
supabase functions deploy scrape-jobs
```

3. Schedule the function:
```bash
supabase functions schedule scrape-jobs --cron "0 17 * * *"
```

## Option 3: External Scheduler Services

For more robust scheduling, consider these external services:

### GitHub Actions:

1. Create a workflow file `.github/workflows/scrape.yml`:

```yaml
name: Daily Job Scraping

on:
  schedule:
    - cron: '0 17 * * *'  # Run at midnight ICT (5pm UTC)

jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger job scraping
        run: |
          curl -X GET "https://your-vercel-app.vercel.app/api/cron/scrape"
```

### Upstash Qstash:

A serverless scheduler service that can call your API endpoint:

1. Sign up for [Upstash Qstash](https://upstash.com/qstash)
2. Schedule a recurring job to hit your API endpoint:
```bash
curl -XPOST "https://qstash.upstash.io/v1/publish/https://your-vercel-app.vercel.app/api/cron/scrape" \
  -H "Authorization: Bearer YOUR_QSTASH_TOKEN" \
  -H "Upstash-Cron: 0 17 * * *"
```

## Execution Time Considerations

**Important Note**: Web scraping can be time-intensive and might exceed function execution limits on serverless platforms:

- Vercel has a 30-second execution limit for Edge functions
- Supabase Edge Functions have a 60-second timeout

For production use, consider these approaches:

1. **Queue-based architecture**: Use the scheduler to add scraping tasks to a queue, then have worker(s) process the queue
2. **Chunking strategy**: Scrape only a subset of users each run, rotating through all users over several days
3. **Dedicated scraping service**: Use a service like AWS Lambda with longer timeouts or a dedicated server 