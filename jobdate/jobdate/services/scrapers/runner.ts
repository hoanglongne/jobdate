import { createClient } from '@supabase/supabase-js';
import { ScraperService } from './ScraperService';
import { SupabaseClientType } from './types';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env file.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey) as SupabaseClientType;

// Initialize the scraper service
const scraperService = new ScraperService(supabase);

/**
 * Main function to run the job scraping process
 */
async function runScraping() {
    console.log('=== Starting job scraping process ===');
    console.log(`Time: ${new Date().toISOString()}`);

    try {
        // Get the user ID from command line args if provided
        const userId = process.argv[2];

        if (userId) {
            // Run for a specific user
            console.log(`Running job scraper for user: ${userId}`);
            await scraperService.runJobScrapingForUser(userId);
        } else {
            // Run for all users
            console.log('Running job scraper for all users');
            await scraperService.runJobScrapingForAllUsers();
        }

        console.log('=== Job scraping process completed successfully ===');
    } catch (error) {
        console.error('Error running job scraping:', error);
        console.log('=== Job scraping process failed ===');
        process.exit(1);
    }
}

// Run the scraping process
runScraping()
    .then(() => {
        console.log('Exiting process');
        process.exit(0);
    })
    .catch(error => {
        console.error('Unhandled error:', error);
        process.exit(1);
    }); 