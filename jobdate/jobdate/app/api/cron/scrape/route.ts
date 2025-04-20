import { createClient } from '@supabase/supabase-js';
import { ScraperService } from '@/services/scrapers/ScraperService';
import { SupabaseClientType } from '@/services/scrapers/types';
import { NextResponse } from 'next/server';

export const config = {
    runtime: 'edge',
    cron: '0 17 * * *'
};

export async function GET(request: Request) {
    try {
        console.log('Starting scheduled job scraping process');

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({
                error: 'Missing Supabase credentials'
            }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey) as SupabaseClientType;

        const scraperService = new ScraperService(supabase);

        await scraperService.runJobScrapingForAllUsers();

        return NextResponse.json({
            success: true,
            message: 'Job scraping process completed',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error in cron job:', error);
        return NextResponse.json({
            error: 'Failed to run job scraping process'
        }, { status: 500 });
    }
} 