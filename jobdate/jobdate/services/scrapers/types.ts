import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Export the Supabase client type to use in our services
export type SupabaseClientType = ReturnType<typeof createClient>;

// User profile interface based on profile page
export interface UserProfile {
    fullname: string;
    role: string;
    work_type: "onsite" | "hydrid" | "remote"; // Note: "hydrid" is the spelling in the existing code
    location: string;
    exp: {
        company: string;
        role: string;
        duration: string;
        desc: string;
    }[];
    skills: string;
    number: string;
}

// Job interface to standardize scraped job data
export interface ScrapedJob {
    role: string;
    company_name: string;
    yoe: number[]; // Years of experience range [min, max]
    jd: {
        title: string;
        content: string[];
    };
    job_link: string;
    logo_url: string;
    skillset: string[];
    salary_range: string[];
    work_type: string;
    location: string;
    contract_type: string;
    source: string; // Which site this job was scraped from
    source_id?: string; // Original ID from the source (if available)
    posted_date?: string; // When the job was posted
}

// Base scraper interface
export interface JobScraper {
    name: string;
    scrape: (userProfile: UserProfile) => Promise<ScrapedJob[]>;
    generateSearchUrl: (userProfile: UserProfile) => string;
    parseJobDetails: (jobUrl: string) => Promise<Partial<ScrapedJob>>;
}

// Job sites available for scraping
export type JobSite = 'linkedin' | 'indeed' | 'glassdoor'; 