import { LinkedInScraper } from './LinkedInScraper';
import { IndeedScraper } from './IndeedScraper';
import { JobScraper, JobSite, ScrapedJob, UserProfile, SupabaseClientType } from './types';
import { createClient } from '@supabase/supabase-js';

// Define a type for the database user structure
interface DBUser {
    id: string;
    full_name: string;
    role: string;
    work_type: "onsite" | "hydrid" | "remote";
    location: string;
    exp: { company: string; role: string; duration: string; desc: string; }[];
    skillset: string;
    number: string;
}

// Define a type for the inserted job from Supabase
interface DBJob {
    id: string;
    [key: string]: any; // Allow for other properties
}

export class ScraperService {
    private scrapers: Map<JobSite, JobScraper>;
    private supabase: SupabaseClientType;

    constructor(supabase: SupabaseClientType) {
        this.supabase = supabase;

        // Initialize scrapers
        this.scrapers = new Map();
        this.scrapers.set('linkedin', new LinkedInScraper());
        this.scrapers.set('indeed', new IndeedScraper());
        // Add more scrapers as needed
    }

    /**
     * Scrape jobs from a specific job site for a given user profile
     */
    async scrapeJobSite(site: JobSite, userProfile: UserProfile): Promise<ScrapedJob[]> {
        const scraper = this.scrapers.get(site);

        if (!scraper) {
            console.error(`No scraper available for ${site}`);
            return [];
        }

        try {
            console.log(`Starting to scrape jobs from ${site} for user ${userProfile.fullname}`);
            const jobs = await scraper.scrape(userProfile);
            console.log(`Scraped ${jobs.length} jobs from ${site}`);
            return jobs;
        } catch (error) {
            console.error(`Error scraping ${site}:`, error);
            return [];
        }
    }

    /**
     * Scrape jobs from multiple sites based on user preferences
     */
    async scrapeJobsForUser(userId: string, sites: JobSite[] = ['linkedin', 'indeed']): Promise<ScrapedJob[]> {
        try {
            // Fetch user profile from database
            const { data: userData, error: userError } = await this.supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            if (userError || !userData) {
                console.error(`Error fetching user data:`, userError);
                return [];
            }

            // Type check and validation
            const userDataObj = userData as Record<string, unknown>;

            // Validate required fields
            if (
                typeof userDataObj.full_name !== 'string' ||
                typeof userDataObj.role !== 'string' ||
                !['onsite', 'hydrid', 'remote'].includes(userDataObj.work_type as string) ||
                typeof userDataObj.location !== 'string' ||
                typeof userDataObj.skillset !== 'string' ||
                typeof userDataObj.number !== 'string'
            ) {
                console.error('Invalid user data format');
                return [];
            }

            // Map database user data to UserProfile interface
            const userProfile: UserProfile = {
                fullname: userDataObj.full_name as string,
                role: userDataObj.role as string,
                work_type: userDataObj.work_type as "onsite" | "hydrid" | "remote",
                location: userDataObj.location as string,
                exp: Array.isArray(userDataObj.exp) ? userDataObj.exp as UserProfile['exp'] : [],
                skills: userDataObj.skillset as string,
                number: userDataObj.number as string
            };

            // Get user's job site preferences if not provided
            if (!sites || sites.length === 0) {
                const { data: settings, error: settingsError } = await this.supabase
                    .from('user_settings')
                    .select('job_sites')
                    .eq('user', userId)
                    .single();

                if (!settingsError && settings &&
                    settings.job_sites &&
                    Array.isArray(settings.job_sites)) {
                    sites = settings.job_sites.filter(site =>
                        typeof site === 'string' &&
                        ['linkedin', 'indeed', 'glassdoor'].includes(site)
                    ) as JobSite[];
                } else {
                    // Default to all available scrapers if no preferences found
                    sites = Array.from(this.scrapers.keys()) as JobSite[];
                }
            }

            console.log(`Scraping jobs from sites: ${sites.join(', ')} for user ${userProfile.fullname}`);

            // Scrape jobs from all selected sites
            const jobPromises = sites.map(site => this.scrapeJobSite(site, userProfile));
            const jobResults = await Promise.all(jobPromises);

            // Flatten results
            const allJobs = jobResults.flat();

            console.log(`Total jobs scraped: ${allJobs.length}`);

            return allJobs;
        } catch (error) {
            console.error(`Error scraping jobs for user:`, error);
            return [];
        }
    }

    /**
     * Save scraped jobs to the database
     */
    async saveScrapedJobs(userId: string, jobs: ScrapedJob[]): Promise<void> {
        if (!jobs.length) {
            console.log('No jobs to save');
            return;
        }

        try {
            console.log(`Saving ${jobs.length} scraped jobs to database for user ${userId}`);

            // First insert the jobs into the jobs table
            const { data: insertedJobs, error: jobError } = await this.supabase
                .from('jobs')
                .upsert(
                    jobs.map(job => ({
                        role: job.role,
                        company_name: job.company_name,
                        yoe: job.yoe,
                        jd: job.jd,
                        job_link: job.job_link,
                        logo_url: job.logo_url,
                        skillset: job.skillset,
                        salary_range: job.salary_range,
                        work_type: job.work_type,
                        location: job.location,
                        contract_type: job.contract_type,
                        source: job.source,
                        source_id: job.source_id
                    })),
                    { onConflict: 'source,source_id' } // Prevent duplicates based on source and source_id
                )
                .select();

            if (jobError) {
                console.error('Error inserting jobs:', jobError);
                return;
            }

            if (!insertedJobs || !Array.isArray(insertedJobs) || insertedJobs.length === 0) {
                console.error('No jobs were inserted');
                return;
            }

            console.log(`Successfully inserted/updated ${insertedJobs.length} jobs`);

            // Then create entries in the jobs_fetched table for the user
            const jobsFetchedData = insertedJobs.map(job => {
                // Validate that job has an id property
                const typedJob = job as DBJob;
                if (!typedJob.id || typeof typedJob.id !== 'string') {
                    console.error('Job missing valid id:', job);
                    return null;
                }

                return {
                    user: userId,
                    jobs: typedJob.id,
                    action: null // No action taken by user yet
                };
            })
                .filter((item): item is { user: string; jobs: string; action: null } => item !== null); // Type-safe filter

            if (jobsFetchedData.length === 0) {
                console.error('No valid jobs_fetched data to insert');
                return;
            }

            const { error: fetchError } = await this.supabase
                .from('jobs_fetched')
                .upsert(
                    jobsFetchedData,
                    { onConflict: 'user,jobs' } // Prevent duplicates based on user and jobs
                );

            if (fetchError) {
                console.error('Error inserting jobs_fetched:', fetchError);
                return;
            }

            console.log(`Successfully inserted/updated ${jobsFetchedData.length} jobs_fetched entries`);
        } catch (error) {
            console.error('Error saving jobs to database:', error);
        }
    }

    /**
     * Run the full scraping process for a user
     */
    async runJobScrapingForUser(userId: string, sites?: JobSite[]): Promise<void> {
        try {
            console.log(`Starting job scraping process for user ${userId}`);

            // Scrape jobs from all relevant sites
            const scrapedJobs = await this.scrapeJobsForUser(userId, sites);

            // Save scraped jobs to database
            await this.saveScrapedJobs(userId, scrapedJobs);

            console.log(`Completed job scraping process for user ${userId}`);
        } catch (error) {
            console.error('Error in job scraping process:', error);
        }
    }

    /**
     * Run job scraping for all users
     */
    async runJobScrapingForAllUsers(): Promise<void> {
        try {
            console.log('Starting job scraping process for all users');

            // Get all users
            const { data: users, error: userError } = await this.supabase
                .from('users')
                .select('id');

            if (userError) {
                console.error('Error fetching users:', userError);
                return;
            }

            if (!users || !Array.isArray(users)) {
                console.error('No users found or invalid data format');
                return;
            }

            console.log(`Found ${users.length} users to scrape jobs for`);

            // Run scraping for each user (sequentially to avoid overwhelming the scraped sites)
            for (const user of users) {
                if (user && typeof user.id === 'string') {
                    await this.runJobScrapingForUser(user.id);

                    // Add a delay between users to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            }

            console.log('Completed job scraping process for all users');
        } catch (error) {
            console.error('Error in job scraping process for all users:', error);
        }
    }
} 