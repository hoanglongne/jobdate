import { JobScraper, ScrapedJob, UserProfile } from './types';
import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer, { Page } from 'puppeteer';

export abstract class BaseScraper implements JobScraper {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    // Each specific scraper must implement these methods
    abstract generateSearchUrl(userProfile: UserProfile): string;
    abstract scrape(userProfile: UserProfile): Promise<ScrapedJob[]>;
    abstract parseJobDetails(jobUrl: string): Promise<Partial<ScrapedJob>>;

    // Common utility methods
    protected async fetchHtml(url: string): Promise<string> {
        try {
            const { data } = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                },
                timeout: 30000,
            });
            return data;
        } catch (error) {
            console.error(`Error fetching ${url}:`, error);
            return '';
        }
    }

    // For JavaScript-heavy sites that require a browser
    protected async fetchWithPuppeteer(url: string): Promise<string> {
        let browser;
        try {
            browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

            // Set default navigation timeout (30 seconds)
            await page.setDefaultNavigationTimeout(30000);

            await page.goto(url, { waitUntil: 'networkidle2' });

            // Sometimes we need to scroll to load lazy content
            await this.autoScroll(page);

            const content = await page.content();
            return content;
        } catch (error) {
            console.error(`Error fetching with Puppeteer ${url}:`, error);
            return '';
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }

    // Helper to scroll page for lazy-loaded content
    private async autoScroll(page: Page): Promise<void> {
        await page.evaluate(async () => {
            await new Promise<void>((resolve) => {
                let totalHeight = 0;
                const distance = 100;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });
    }

    // Extract years of experience from job description text
    protected extractYearsOfExperience(text: string): number[] {
        // Look for patterns like "2-3 years", "2+ years", "minimum 2 years"
        const patterns = [
            /(\d+)\s*-\s*(\d+)\s*(?:years|yrs|year)/i,  // "2-3 years"
            /(\d+)\s*\+\s*(?:years|yrs|year)/i,        // "2+ years"
            /(?:minimum|min|at least)\s*(\d+)\s*(?:years|yrs|year)/i, // "minimum 2 years"
            /(\d+)\s*(?:years|yrs|year)/i              // "2 years"
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                if (match[2]) {
                    // Range like "2-3 years"
                    return [parseInt(match[1]), parseInt(match[2])];
                } else {
                    // Single value like "2+ years" or "minimum 2 years"
                    return [parseInt(match[1])];
                }
            }
        }

        // Default to empty if no match found
        return [];
    }

    // Extract salary information from text
    protected extractSalaryRange(text: string): string[] {
        // Look for common salary patterns
        const patterns = [
            /\$(\d+,?\d*)\s*-\s*\$?(\d+,?\d*)/i,  // "$50,000 - $70,000"
            /(\d+,?\d*)\s*-\s*(\d+,?\d*)\s*(?:USD|EUR|GBP|\$|€|£)/i, // "50,000 - 70,000 USD"
            /(?:USD|EUR|GBP|\$|€|£)\s*(\d+,?\d*)/i // "$50,000"
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                if (match[2]) {
                    // Range
                    const min = match[1].replace(/,/g, '');
                    const max = match[2].replace(/,/g, '');
                    return [min, max];
                } else {
                    // Single value
                    const value = match[1].replace(/,/g, '');
                    return [value, value];
                }
            }
        }

        return [];
    }

    // Extract skills from job description
    protected extractSkills(text: string, commonSkills: string[]): string[] {
        const foundSkills: string[] = [];

        // Convert text to lowercase for case-insensitive matching
        const lowerText = text.toLowerCase();

        // Check for each skill in the text
        commonSkills.forEach(skill => {
            const skillLower = skill.toLowerCase();
            // Use word boundaries to avoid partial matches
            const pattern = new RegExp(`\\b${skillLower}\\b`, 'i');
            if (pattern.test(lowerText)) {
                foundSkills.push(skill);
            }
        });

        return foundSkills;
    }

    // Extract work type (remote, hybrid, onsite)
    protected extractWorkType(text: string): string {
        const lowerText = text.toLowerCase();

        if (lowerText.includes('remote') || lowerText.includes('work from home')) {
            return 'remote';
        } else if (lowerText.includes('hybrid')) {
            return 'hybrid';
        } else if (lowerText.includes('on-site') || lowerText.includes('onsite') || lowerText.includes('in office')) {
            return 'onsite';
        }

        return 'hybrid'; // Default if not specified
    }
} 