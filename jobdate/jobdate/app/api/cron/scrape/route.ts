import { createClient } from '@supabase/supabase-js';
import { ScraperService } from '@/services/scrapers/ScraperService';
import { SupabaseClientType } from '@/services/scrapers/types';
import { NextResponse } from 'next/server';

// Define Vercel specific cron config
export const config = {
    runtime: 'edge',
    // Run at midnight ICT (UTC+7) -> 17:00 UTC of the previous day
    cron: '0 17 * * *'
};

export async function GET(request: Request) {
    try {
        console.log('Starting scheduled job scraping process');

        // Initialize Supabase client
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        const browserlessApiKey = process.env.BROWSERLESS_API_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({
                error: 'Missing Supabase credentials'
            }, { status: 500 });
        }

        if (!browserlessApiKey) {
            return NextResponse.json({
                error: 'Missing BROWSERLESS_API_KEY. Set this environment variable in your Vercel project settings.'
            }, { status: 500 });
        }

        console.log('Initializing services...');
        const supabase = createClient(supabaseUrl, supabaseKey) as SupabaseClientType;

        // Check that Browserless key is present in environment
        if (!process.env.BROWSERLESS_API_KEY) {
            process.env.BROWSERLESS_API_KEY = browserlessApiKey;
        }

        // Try to get a count of users as a basic test
        try {
            const { count, error } = await supabase
                .from('users')
                .select('*', { count: 'exact', head: true });

            console.log(`Found ${count || 0} users to process`);

            if (error) {
                console.error('Error connecting to database:', error);
                return NextResponse.json({
                    error: 'Database connection test failed',
                    details: error.message
                }, { status: 500 });
            }
        } catch (dbError: any) {
            console.error('Error testing database connection:', dbError);
            return NextResponse.json({
                error: 'Database connection test failed',
                details: dbError.message
            }, { status: 500 });
        }

        // Initialize the scraper service
        console.log('Initializing scraper service...');
        const scraperService = new ScraperService(supabase);

        // Get URL parameters to see if we should run for a specific user
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId');

        if (userId) {
            // Run for a specific user
            console.log(`Running job scraper for specific user: ${userId}`);
            await scraperService.runJobScrapingForUser(userId);
        } else {
            // Run for all users
            console.log('Running job scraper for all users');
            await scraperService.runJobScrapingForAllUsers();
        }

        console.log('Job scraping process completed');

        return NextResponse.json({
            success: true,
            message: 'Job scraping process completed',
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Error in cron job:', error);
        return NextResponse.json({
            error: 'Failed to run job scraping process',
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
} 