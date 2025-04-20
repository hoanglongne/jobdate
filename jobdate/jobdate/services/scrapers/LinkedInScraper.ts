import { BaseScraper } from './BaseScraper';
import { ScrapedJob, UserProfile } from './types';
import * as cheerio from 'cheerio';

// Common tech skills to look for in job descriptions
const COMMON_SKILLS = [
    'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue.js', 'Node.js',
    'Express', 'Next.js', 'HTML', 'CSS', 'SASS', 'LESS', 'Tailwind',
    'Bootstrap', 'Material UI', 'Redux', 'GraphQL', 'REST', 'API',
    'Git', 'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes',
    'CI/CD', 'Jenkins', 'GitHub Actions', 'Python', 'Django', 'Flask',
    'Java', 'Spring', 'C#', '.NET', 'PHP', 'Laravel', 'Ruby', 'Rails',
    'Go', 'Rust', 'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'MySQL',
    'Redis', 'ElasticSearch', 'RabbitMQ', 'Kafka', 'Agile', 'Scrum',
    'JIRA', 'Confluence', 'Figma', 'Sketch', 'Adobe XD', 'Photoshop',
    'Illustrator', 'UI/UX', 'TDD', 'BDD', 'Jest', 'Mocha', 'Cypress',
    'Playwright', 'Selenium', 'WebDriver', 'React Native', 'Flutter',
    'iOS', 'Android', 'Swift', 'Kotlin', 'Machine Learning', 'AI',
    'Data Science', 'Data Analysis', 'Data Visualization', 'Blockchain',
    'Web3', 'Ethereum', 'Solidity', 'NFT', 'Smart Contract'
];

export class LinkedInScraper extends BaseScraper {
    constructor() {
        super('linkedin');
    }

    generateSearchUrl(userProfile: UserProfile): string {
        // Construct LinkedIn search URL based on user profile
        const baseUrl = 'https://www.linkedin.com/jobs/search/?';

        // Prepare search parameters
        const params = new URLSearchParams();

        // Add user's role/position
        if (userProfile.role) {
            params.append('keywords', userProfile.role);
        }

        // Add location
        if (userProfile.location) {
            params.append('location', userProfile.location);
        }

        // Add remote filter if user prefers remote work
        if (userProfile.work_type === 'remote') {
            params.append('f_WT', '2');
        } else if (userProfile.work_type === 'hydrid') {
            params.append('f_WT', '1');
        } else {
            params.append('f_WT', '0'); // onsite
        }

        // Add experience level filter based on user's experience
        // Experience levels on LinkedIn: 1 (Internship), 2 (Entry level), 3 (Associate), 4 (Mid-Senior), 5 (Director), 6 (Executive)
        const yearsOfExperience = this.estimateYearsOfExperience(userProfile.exp);
        if (yearsOfExperience < 1) {
            params.append('f_E', '1,2'); // Internship, Entry level
        } else if (yearsOfExperience < 3) {
            params.append('f_E', '2,3'); // Entry level, Associate
        } else if (yearsOfExperience < 6) {
            params.append('f_E', '3,4'); // Associate, Mid-Senior
        } else {
            params.append('f_E', '4,5,6'); // Mid-Senior, Director, Executive
        }

        // Set sorting to recent jobs
        params.append('sortBy', 'DD'); // Date descending (most recent first)

        // Generate the full URL
        return `${baseUrl}${params.toString()}`;
    }

    // Estimate years of experience based on user's experience array
    private estimateYearsOfExperience(experiences: UserProfile['exp']): number {
        if (!experiences || experiences.length === 0) {
            return 0;
        }

        let totalYears = 0;

        for (const exp of experiences) {
            const duration = exp.duration;
            // Try to extract years from duration strings like "2 years", "1 year 6 months", etc.
            const yearMatch = duration.match(/(\d+)\s*(?:year|yr|y)/i);
            const monthMatch = duration.match(/(\d+)\s*(?:month|mo|m)/i);

            if (yearMatch) {
                totalYears += parseInt(yearMatch[1]);
            }

            if (monthMatch) {
                totalYears += parseInt(monthMatch[1]) / 12;
            }
        }

        return Math.round(totalYears);
    }

    async scrape(userProfile: UserProfile): Promise<ScrapedJob[]> {
        try {
            const searchUrl = this.generateSearchUrl(userProfile);
            console.log(`Scraping LinkedIn jobs with URL: ${searchUrl}`);

            // LinkedIn uses JavaScript to load content, so we need to use Puppeteer
            const html = await this.fetchWithPuppeteer(searchUrl);

            if (!html) {
                console.error("Failed to fetch LinkedIn jobs page");
                return [];
            }

            const $ = cheerio.load(html);
            const jobs: ScrapedJob[] = [];

            // LinkedIn job cards selector - this might need adjustment based on LinkedIn's current HTML structure
            $('.job-search-card').each((_, element) => {
                try {
                    // Extract basic job info from the search results page
                    const titleElement = $(element).find('.job-search-card__title');
                    const companyElement = $(element).find('.job-search-card__subtitle');
                    const locationElement = $(element).find('.job-search-card__location');
                    const jobLink = $(element).find('.job-search-card__title a').attr('href');
                    const logoElement = $(element).find('.job-search-card__company-logo');
                    const logoUrl = logoElement.attr('src') || '';

                    // Extract the job ID for further API calls if needed
                    const jobId = this.extractJobId(jobLink || '');

                    if (titleElement.length > 0 && companyElement.length > 0 && jobLink) {
                        const job: ScrapedJob = {
                            role: titleElement.text().trim(),
                            company_name: companyElement.text().trim(),
                            location: locationElement.text().trim(),
                            job_link: jobLink,
                            logo_url: logoUrl,
                            yoe: [], // Will try to extract from job details
                            jd: {
                                title: "Job Description",
                                content: [] // Will fill from job details
                            },
                            skillset: [], // Will try to extract from job details
                            salary_range: [], // Will try to extract from job details
                            work_type: 'hybrid', // Default, will try to extract from job details
                            contract_type: 'Full-time', // Default, will try to extract from job details
                            source: 'linkedin',
                            source_id: jobId
                        };

                        jobs.push(job);
                    }
                } catch (error) {
                    console.error("Error parsing job card:", error);
                }
            });

            console.log(`Found ${jobs.length} jobs on LinkedIn`);

            // For each job, try to get additional details (this is optional and can be resource-intensive)
            // You might want to limit this to the first few jobs or implement pagination
            const MAX_DETAILED_JOBS = 10;
            const detailedJobs: ScrapedJob[] = [];

            for (let i = 0; i < Math.min(jobs.length, MAX_DETAILED_JOBS); i++) {
                try {
                    const job = jobs[i];
                    console.log(`Fetching details for job: ${job.role} at ${job.company_name}`);

                    // Get detailed job info
                    const details = await this.parseJobDetails(job.job_link);

                    // Merge the details with the basic job info
                    detailedJobs.push({
                        ...job,
                        ...details
                    });

                    // Add a delay to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 2000));
                } catch (error) {
                    console.error(`Error fetching job details:`, error);
                    detailedJobs.push(jobs[i]);
                }
            }

            return detailedJobs.length > 0 ? detailedJobs : jobs;
        } catch (error) {
            console.error("Error scraping LinkedIn jobs:", error);
            return [];
        }
    }

    // Extract LinkedIn job ID from URL
    private extractJobId(url: string): string {
        const match = url.match(/view\/(\d+)/);
        return match ? match[1] : '';
    }

    async parseJobDetails(jobUrl: string): Promise<Partial<ScrapedJob>> {
        try {
            console.log(`Parsing job details from: ${jobUrl}`);

            // LinkedIn job details require JavaScript, so use Puppeteer
            const html = await this.fetchWithPuppeteer(jobUrl);

            if (!html) {
                throw new Error("Failed to fetch job details");
            }

            const $ = cheerio.load(html);

            // Extract job description
            const jobDescriptionElement = $('.description__text');
            const jobDescriptionText = jobDescriptionElement.text().trim();
            const jobDescriptionHtml = jobDescriptionElement.html() || '';

            // Split job description into paragraphs
            const jobDescriptionParagraphs = jobDescriptionText
                .split('\n')
                .filter(p => p.trim().length > 0)
                .map(p => p.trim());

            // Extract years of experience from job description
            const yoe = this.extractYearsOfExperience(jobDescriptionText);

            // Extract skills from job description
            const skills = this.extractSkills(jobDescriptionText, COMMON_SKILLS);

            // Extract salary if available
            const salaryText = $('.compensation__salary-range').text().trim();
            const salaryRange = this.extractSalaryRange(salaryText || jobDescriptionText);

            // Extract employment type
            const employmentTypeElement = $('.job-criteria__item:contains("Employment type") .job-criteria__text');
            const employmentType = employmentTypeElement.text().trim();

            // Determine contract type
            let contractType = 'Full-time';
            if (employmentType) {
                if (employmentType.toLowerCase().includes('part-time')) {
                    contractType = 'Part-time';
                } else if (employmentType.toLowerCase().includes('contract')) {
                    contractType = 'Contract';
                } else if (employmentType.toLowerCase().includes('temporary')) {
                    contractType = 'Temporary';
                } else if (employmentType.toLowerCase().includes('internship')) {
                    contractType = 'Internship';
                }
            }

            // Determine work type
            const workType = this.extractWorkType(jobDescriptionText);

            return {
                jd: {
                    title: "Job Description",
                    content: jobDescriptionParagraphs.length > 0
                        ? jobDescriptionParagraphs
                        : ["No detailed description available"]
                },
                yoe,
                skillset: skills,
                salary_range: salaryRange,
                work_type: workType,
                contract_type: contractType
            };
        } catch (error) {
            console.error(`Error parsing job details from ${jobUrl}:`, error);
            return {};
        }
    }
} 