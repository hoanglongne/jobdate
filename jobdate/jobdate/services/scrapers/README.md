# JobDate Job Scraper Service

This service scrapes job listings from various job sites (LinkedIn, Indeed, etc.) based on user profile data and preferences.

## Overview

The job scraper service:

1. Fetches user profiles from the database
2. Scrapes job postings from configured job sites based on user preferences
3. Filters and processes the job data to match our database schema
4. Stores the scraped jobs in the database
5. Creates relationships between users and jobs in the `jobs_fetched` table

## Usage

### Running the service for all users:

```bash
# Run for all users
yarn scrape
```

### Running for a specific user:

```bash
# Run for a specific user by providing their ID
yarn scrape:user USER_ID
```

For example:
```bash
yarn scrape:user abc123def456
```

## Implementation Details

The scraper is built with a modular design:

- `BaseScraper` - Abstract base class with common utility methods
- `LinkedInScraper` - LinkedIn-specific implementation
- `IndeedScraper` - Indeed-specific implementation
- `ScraperService` - Main service that coordinates job scraping
- `runner.ts` - CLI script to run the service

### Adding New Job Site Scrapers

To add support for a new job site:

1. Create a new class that extends `BaseScraper`
2. Implement the required methods:
   - `generateSearchUrl(userProfile)`
   - `scrape(userProfile)`
   - `parseJobDetails(jobUrl)`
3. Add the new scraper to the map in `ScraperService`

## Technical Notes

- The service uses Puppeteer for JavaScript-heavy sites that require a browser
- Cheerio is used for HTML parsing
- Rate limiting is implemented to avoid overwhelming job sites
- Type safety is ensured with TypeScript interfaces

## Legal Considerations

When using web scrapers, be aware of:

1. Terms of Service for each job site
2. Rate limiting to avoid overloading servers
3. Respecting robots.txt files
4. Using user-agent headers responsibly

This scraper is intended for personal/educational use. For production deployments, consider using official APIs when available. 