import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const jobData = [
    {
        role: 'Junior Frontend Engineer',
        company_name: 'VNG Corporation',
        yoe: [2],
        jd: {
            title: 'Job Description',
            content: [
                'Fullstack Dev and Web3 Enthusiast',
                'Bachelor in CS/SE or related field',
                '2 years of experience working with Fullstack role',
                'Fast learner',
                'Preferred: Docker/Kubernetes'
            ]
        },
        job_link: 'https://vng.com.vn/jobs',
        logo_url: 'https://vng.com.vn/logo.png',
        skillset: ['Nextjs', 'Typescript', 'Tailwindcss', 'Supabase', 'Vercel'],
        salary_range: ['800', '1200'],
        work_type: 'hybrid',
        location: 'Ho Chi Minh City',
        contract_type: 'Full-time'
    },
];

async function seedJobs() {
    try {
        console.log('Starting to seed jobs...');


        const { data: insertedJobs, error: jobError } = await supabase
            .from('jobs')
            .insert(jobData)
            .select();

        if (jobError) {
            throw jobError;
        }

        console.log(`Successfully inserted ${insertedJobs.length} jobs`);


        const { data: users, error: userError } = await supabase
            .from('users')
            .select('id');

        if (userError) {
            throw userError;
        }


        for (const user of users) {
            const jobsFetchedData = insertedJobs.map(job => ({
                user: user.id,
                jobs: job.id,
                action: null
            }));

            const { error: fetchError } = await supabase
                .from('jobs_fetched')
                .insert(jobsFetchedData);

            if (fetchError) {
                console.error(`Error creating jobs_fetched for user ${user.id}:`, fetchError);
                continue;
            }
        }

        console.log('Seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding data:', error);
        throw error;
    }
}

seedJobs()
    .catch((error) => {
        console.error('Seeding failed:', error);
        process.exit(1);
    })
    .finally(async () => {
        console.log('Seeding finished');
        process.exit(0);
    }); 