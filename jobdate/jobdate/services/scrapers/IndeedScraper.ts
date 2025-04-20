import { BaseScraper } from './BaseScraper';
import { ScrapedJob, UserProfile } from './types';
import * as cheerio from 'cheerio';

// Reuse the common skills array from LinkedIn scraper
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

export class IndeedScraper extends BaseScraper {
    constructor() {
        super('indeed');
    }

    generateSearchUrl(userProfile: UserProfile): string {
        // Construct Indeed search URL based on user profile
        const baseUrl = 'https://www.indeed.com/jobs?';

        // Prepare search parameters
        const params = new URLSearchParams();

        // Add user's role/position as query (q parameter)
        if (userProfile.role) {
            params.append('q', userProfile.role);
        }

        // Add location (l parameter)
        if (userProfile.location) {
            params.append('l', userProfile.location);
        }

        // Add remote filter if user prefers remote work
        if (userProfile.work_type === 'remote') {
            params.append('remotejob', '032b3046-06a3-4876-8dfd-474eb5e7ed11'); // Indeed's remote job identifier
        }

        // Add experience level based on user's experience
        const yearsOfExperience = this.estimateYearsOfExperience(userProfile.exp);
        if (yearsOfExperience < 1) {
            params.append('explvl', 'entry_level'); // Entry level
        } else if (yearsOfExperience < 3) {
            params.append('explvl', 'mid_level'); // Mid level
        } else if (yearsOfExperience < 7) {
            params.append('explvl', 'senior_level'); // Senior level
        } else {
            params.append('explvl', 'executive_level'); // Executive level
        }

        // Sort by date (sort parameter)
        params.append('sort', 'date');

        // Add limit to number of results (limit parameter, default is 10)
        params.append('limit', '20');

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
            console.log(`Scraping Indeed jobs with URL: ${searchUrl}`);

            // Indeed uses JavaScript to load content, so we need to use Puppeteer
            const html = await this.fetchWithPuppeteer(searchUrl);

            if (!html) {
                console.error("Failed to fetch Indeed jobs page");
                return [];
            }

            const $ = cheerio.load(html);
            const jobs: ScrapedJob[] = [];

            // Indeed job cards selector - this might need adjustment based on Indeed's current HTML structure
            $('.job_seen_beacon').each((_, element) => {
                try {
                    // Extract basic job info from the search results page
                    const titleElement = $(element).find('.jcs-JobTitle');
                    const companyElement = $(element).find('.companyName');
                    const locationElement = $(element).find('.companyLocation');
                    const jobUrl = titleElement.attr('href') || '';
                    const fullJobUrl = jobUrl.startsWith('http') ? jobUrl : `https://www.indeed.com${jobUrl}`;
                    const logoElement = $(element).find('.companyAvatar-image');
                    const logoUrl = logoElement.attr('src') || '';
                    const salaryElement = $(element).find('.salary-snippet-container');
                    const jobSnippetElement = $(element).find('.job-snippet');

                    // Extract the job ID from the data-jk attribute if available
                    const jobId = $(element).attr('data-jk') || '';

                    if (titleElement.length > 0 && companyElement.length > 0) {
                        // Try to extract work type and contract type from the job snippet
                        const snippetText = jobSnippetElement.text().trim();
                        const workType = this.extractWorkType(snippetText);

                        // Try to determine contract type
                        let contractType = 'Full-time';
                        if (snippetText.toLowerCase().includes('part-time')) {
                            contractType = 'Part-time';
                        } else if (snippetText.toLowerCase().includes('contract')) {
                            contractType = 'Contract';
                        } else if (snippetText.toLowerCase().includes('temporary')) {
                            contractType = 'Temporary';
                        } else if (snippetText.toLowerCase().includes('internship')) {
                            contractType = 'Internship';
                        }

                        // Try to extract salary from salary element
                        const salaryText = salaryElement.text().trim();
                        const salaryRange = this.extractSalaryRange(salaryText);

                        const job: ScrapedJob = {
                            role: titleElement.text().trim(),
                            company_name: companyElement.text().trim(),
                            location: locationElement.text().trim(),
                            job_link: fullJobUrl,
                            logo_url: logoUrl,
                            yoe: this.extractYearsOfExperience(snippetText), // Try to extract from snippet
                            jd: {
                                title: "Job Description",
                                content: [snippetText] // Basic description from snippet
                            },
                            skillset: this.extractSkills(snippetText, COMMON_SKILLS), // Try to extract from snippet
                            salary_range: salaryRange,
                            work_type: workType,
                            contract_type: contractType,
                            source: 'indeed',
                            source_id: jobId
                        };

                        jobs.push(job);
                    }
                } catch (error) {
                    console.error("Error parsing job card:", error);
                }
            });

            console.log(`Found ${jobs.length} jobs on Indeed`);

            // For each job, try to get additional details
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
            console.error("Error scraping Indeed jobs:", error);
            return [];
        }
    }

    async parseJobDetails(jobUrl: string): Promise<Partial<ScrapedJob>> {
        try {
            console.log(`Parsing job details from: ${jobUrl}`);

            // Indeed job details require JavaScript, so use Puppeteer
            const html = await this.fetchWithPuppeteer(jobUrl);

            if (!html) {
                throw new Error("Failed to fetch job details");
            }

            const $ = cheerio.load(html);

            // Extract job description - Indeed uses different selectors, might need adjustment
            const jobDescriptionElement = $('#jobDescriptionText');
            const jobDescriptionText = jobDescriptionElement.text().trim();

            // Split job description into paragraphs
            const jobDescriptionParagraphs = jobDescriptionText
                .split('\n')
                .filter(p => p.trim().length > 0)
                .map(p => p.trim());

            // Extract years of experience from job description
            const yoe = this.extractYearsOfExperience(jobDescriptionText);

            // Extract skills from job description
            const skills = this.extractSkills(jobDescriptionText, COMMON_SKILLS);

            // Extract salary if available - Indeed typically displays this in search results
            // but sometimes also in the job details
            const salaryElement = $('.jobsearch-JobMetadataHeader-item:contains("$")');
            const salaryText = salaryElement.text().trim();
            const salaryRange = this.extractSalaryRange(salaryText || jobDescriptionText);

            // Extract job type info (full-time, part-time, etc.)
            const jobTypeElement = $('.jobsearch-JobMetadataHeader-item:contains("time")');
            const jobTypeText = jobTypeElement.text().trim();

            // Determine contract type
            let contractType = 'Full-time';
            if (jobTypeText) {
                if (jobTypeText.toLowerCase().includes('part-time')) {
                    contractType = 'Part-time';
                } else if (jobTypeText.toLowerCase().includes('contract')) {
                    contractType = 'Contract';
                } else if (jobTypeText.toLowerCase().includes('temporary')) {
                    contractType = 'Temporary';
                } else if (jobTypeText.toLowerCase().includes('internship')) {
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
                yoe: yoe.length > 0 ? yoe : [],
                skillset: skills,
                salary_range: salaryRange.length > 0 ? salaryRange : [],
                work_type: workType,
                contract_type: contractType
            };
        } catch (error) {
            console.error(`Error parsing job details from ${jobUrl}:`, error);
            return {};
        }
    }
} 