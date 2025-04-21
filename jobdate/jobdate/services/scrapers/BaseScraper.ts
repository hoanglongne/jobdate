import { JobScraper, ScrapedJob, UserProfile } from './types';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { getBrowserlessContentApiUrl } from './config/browserless';

export abstract class BaseScraper implements JobScraper {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    abstract generateSearchUrl(userProfile: UserProfile): string;
    abstract scrape(userProfile: UserProfile): Promise<ScrapedJob[]>;
    abstract parseJobDetails(jobUrl: string): Promise<Partial<ScrapedJob>>;

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

    protected async fetchWithPuppeteer(url: string): Promise<string> {
        try {
            console.log(`Fetching ${url} with Browserless Content API`);
            const browserlessUrl = getBrowserlessContentApiUrl(url);

            const options = {
                timeout: 60000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                },
                params: {
                    stealth: true,
                    waitFor: 5000,
                    scrollPage: true,
                }
            };

            const response = await axios.get(browserlessUrl, options);

            if (response.status === 200 && response.data) {
                return response.data;
            } else {
                console.error(`Browserless returned status ${response.status}`);
                return '';
            }
        } catch (error: any) {
            console.error(`Error with Browserless Content API: ${error.message}`);
            return '';
        }
    }

    protected extractYearsOfExperience(text: string): number[] {
        const patterns = [
            /(\d+)\s*-\s*(\d+)\s*(?:years|yrs|year)/i,
            /(\d+)\s*\+\s*(?:years|yrs|year)/i,
            /(?:minimum|min|at least)\s*(\d+)\s*(?:years|yrs|year)/i,
            /(\d+)\s*(?:years|yrs|year)/i
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                if (match[2]) {
                    return [parseInt(match[1]), parseInt(match[2])];
                } else {
                    return [parseInt(match[1])];
                }
            }
        }

        return [];
    }

    protected extractSalaryRange(text: string): string[] {
        const patterns = [
            /\$(\d+,?\d*)\s*-\s*\$?(\d+,?\d*)/i,
            /(\d+,?\d*)\s*-\s*(\d+,?\d*)\s*(?:USD|EUR|GBP|\$|€|£)/i,
            /(?:USD|EUR|GBP|\$|€|£)\s*(\d+,?\d*)/i
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                if (match[2]) {
                    const min = match[1].replace(/,/g, '');
                    const max = match[2].replace(/,/g, '');
                    return [min, max];
                } else {
                    const value = match[1].replace(/,/g, '');
                    return [value, value];
                }
            }
        }

        return [];
    }

    protected extractSkills(text: string, commonSkills: string[]): string[] {
        const foundSkills: string[] = [];

        const lowerText = text.toLowerCase();

        commonSkills.forEach(skill => {
            const skillLower = skill.toLowerCase();
            const pattern = new RegExp(`\\b${skillLower}\\b`, 'i');
            if (pattern.test(lowerText)) {
                foundSkills.push(skill);
            }
        });

        return foundSkills;
    }

    protected extractWorkType(text: string): string {
        const lowerText = text.toLowerCase();

        if (lowerText.includes('remote') || lowerText.includes('work from home')) {
            return 'remote';
        } else if (lowerText.includes('hybrid')) {
            return 'hybrid';
        } else if (lowerText.includes('on-site') || lowerText.includes('onsite') || lowerText.includes('in office')) {
            return 'onsite';
        }

        return 'hybrid';
    }
} 