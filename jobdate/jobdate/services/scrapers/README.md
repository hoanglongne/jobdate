# JobDate Job Scraper Service

This service scrapes job listings from various job sites (LinkedIn, Indeed, etc.) based on user profile data and preferences.

## Overview

The job scraper service:

1. Fetches user profiles from the database
2. Scrapes job postings from configured job sites based on user preferences
3. Filters and processes the job data to match our database schema
4. Stores the scraped jobs in the database
5. Creates relationships between users and jobs in the `jobs_fetched` table

## Setup

### 1. Browserless.io Account

This service uses [Browserless.io](https://browserless.io) for headless browser functionality. Their free tier includes 1,000 sessions per month.

1. Sign up for a Browserless.io account
2. Get your API key from the dashboard
3. Add the API key to your environment variables:

```
BROWSERLESS_API_KEY=your-api-key-here
```

If using Vercel, add this environment variable in your project settings.

### 2. Deploy the Service

The service is deployed as part of your Next.js application on Vercel and runs using Vercel's cron jobs feature.

## Usage

### Running the service for all users on Vercel:

The service will automatically run daily at midnight ICT (5pm UTC).

To manually trigger the job:

```bash
# Trigger the cron job manually
curl https://your-vercel-app.vercel.app/api/cron/scrape
```

### Running for a specific user:

```bash
# Run for a specific user by providing their ID as a query parameter
curl https://your-vercel-app.vercel.app/api/cron/scrape?userId=USER_ID
```

### Local Development

For local development, you can use the CLI:

```bash
# Run for all users
yarn scrape

# Run for a specific user
yarn scrape:user USER_ID
```

## Implementation Details

The scraper is built with a modular design:

- `BaseScraper` - Abstract base class with common utility methods
- `LinkedInScraper` - LinkedIn-specific implementation
- `IndeedScraper` - Indeed-specific implementation
- `ScraperService` - Main service that coordinates job scraping
- `runner.ts` - CLI script to run the service
- `config/browserless.ts` - Configuration for Browserless.io integration

### Adding New Job Site Scrapers

To add support for a new job site:

1. Create a new class that extends `BaseScraper`
2. Implement the required methods:
   - `generateSearchUrl(userProfile)`
   - `scrape(userProfile)`
   - `parseJobDetails(jobUrl)`
3. Add the new scraper to the map in `ScraperService`

## Technical Notes

- The service uses Browserless.io for browser automation instead of local Puppeteer
- Cheerio is used for HTML parsing
- Rate limiting is implemented to avoid overwhelming job sites
- Type safety is ensured with TypeScript interfaces

This scraper is intended for personal/educational use. For production deployments, consider using official APIs when available. 