import { createClient } from '@supabase/supabase-js';
import { SupabaseClientType } from '@/services/scrapers/types';
import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Define Vercel specific cron config
export const config = {
    runtime: 'edge',
    // Run at midnight ICT (UTC+7) -> 17:00 UTC of the previous day
    cron: '0 17 * * *'
};

// Simple API-based job scraper (no puppeteer)
async function scrapeJobs(userId: string, role: string, location: string) {
    try {
        console.log(`Scraping jobs for user ${userId} with role ${role} in ${location}`);

        // Use a public jobs API instead of browser scraping
        // For this example, we'll use a simple approach with GitHub Jobs API-like structure
        const jobsData = [];

        // Example: Fetch jobs from GitHub Jobs API (no longer active, just for example)
        // const response = await axios.get(`https://jobs.github.com/positions.json?description=${role}&location=${location}`);
        // const jobsData = response.data;

        // For demo, generate sample job data
        for (let i = 0; i < 5; i++) {
            jobsData.push({
                id: `job-${Date.now()}-${i}`,
                role: `${role} Developer`,
                company_name: `Company ${i + 1}`,
                location: location,
                job_link: `https://example.com/jobs/${i}`,
                logo_url: `https://via.placeholder.com/150?text=Company${i + 1}`,
                yoe: [2, 5],
                jd: {
                    title: "Job Description",
                    content: [
                        `We're looking for a talented ${role} Developer to join our team.`,
                        "Must have strong programming skills and problem-solving abilities.",
                        "Experience with modern frameworks and tools is required."
                    ]
                },
                skillset: ["JavaScript", "TypeScript", "React", "Node.js"],
                salary_range: ["2000", "4000"],
                work_type: "hybrid",
                contract_type: "Full-time",
                source: "api-generated",
                source_id: `sample-${i}`
            });
        }

        return jobsData;
    } catch (error) {
        console.error('Error scraping jobs:', error);
        return [];
    }
}

export async function GET(request: Request) {
    try {
        console.log('Starting scheduled job scraping process');

        // Initialize Supabase client
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({
                error: 'Missing Supabase credentials'
            }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey) as SupabaseClientType;

        // Get all users
        const { data: users, error: userError } = await supabase
            .from('users')
            .select('id, full_name, role, location');

        if (userError) {
            console.error('Error fetching users:', userError);
            return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
        }

        if (!users || !Array.isArray(users) || users.length === 0) {
            return NextResponse.json({ message: 'No users found' }, { status: 200 });
        }

        console.log(`Found ${users.length} users to scrape jobs for`);

        // Process up to 5 users per run (to avoid timeouts)
        // In production, you might want to implement a queue system
        const usersToProcess = users.slice(0, 5);

        // For each user, fetch relevant jobs
        for (const user of usersToProcess) {
            if (user && user.id && user.role && user.location) {
                // Scrape jobs for this user using API-based approach
                const scrapedJobs = await scrapeJobs(
                    user.id as string,
                    user.role as string,
                    user.location as string
                );

                console.log(`Found ${scrapedJobs.length} jobs for user ${user.id}`);

                if (scrapedJobs.length > 0) {
                    // Insert jobs into database
                    const { data: insertedJobs, error: jobError } = await supabase
                        .from('jobs')
                        .upsert(
                            scrapedJobs.map(job => ({
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
                            { onConflict: 'source,source_id' }
                        )
                        .select();

                    if (jobError) {
                        console.error(`Error inserting jobs for user ${user.id}:`, jobError);
                        continue;
                    }

                    // Create relationships between user and jobs
                    if (insertedJobs && insertedJobs.length > 0) {
                        const jobsFetchedData = insertedJobs.map(job => ({
                            user: user.id,
                            jobs: job.id,
                            action: null
                        }));

                        const { error: fetchError } = await supabase
                            .from('jobs_fetched')
                            .upsert(
                                jobsFetchedData,
                                { onConflict: 'user,jobs' }
                            );

                        if (fetchError) {
                            console.error(`Error creating job relationships for user ${user.id}:`, fetchError);
                        } else {
                            console.log(`Created ${jobsFetchedData.length} job relationships for user ${user.id}`);
                        }
                    }
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: `Job scraping completed for ${usersToProcess.length} users`,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error in cron job:', error);
        return NextResponse.json({
            error: 'Failed to run job scraping process'
        }, { status: 500 });
    }
} 