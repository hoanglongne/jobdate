'use client'
import React from 'react'
import { ExpCardProps } from '@/utils/types'
import { createClient } from '@/utils/supabase/client'
import { SupabaseClient } from '@supabase/supabase-js'

const ExpCard: React.FC<ExpCardProps> = ({ userId }) => {
    const supabase: SupabaseClient = createClient();
    const [experiences, setExperiences] = React.useState<any[]>([]);

    //TODO: Chuyển cái đống này và func Delete lên ExpBar để có thể map tụi nó ra sau khi xoá
    React.useEffect(() => {
        async function fetchExperiences() {
            const { data, error } = await supabase
                .from('users')
                .select('exp')
                .eq('id', userId);
            if (error) {
                console.error('Error fetching experiences:', error);
                return;
            }
            setExperiences(data && data[0].exp);
        }

        fetchExperiences();
    }, []);

    const deleteExperience = async () => {
        // Remove the desired experience from the array
        const updatedExperiences = experiences?.splice(0, 1);

        // Update the array in the database
        let { error: updateError } = await supabase
            .from('users')
            .update({ exp: updatedExperiences })
            .eq('id', userId); // replace with your actual user ID

        if (updateError) {
            console.error('Error updating experiences:', updateError);
            return;
        }
    };

    return (
        <div className='relative border-[2.5px] border-card py-6 px-3 md:px-4 lg:px8 w-full bg-[#FFF9F4] flex flex-col items-center gap-5 md:gap-2 rounded-xl text-card font-medium mb-5'>
            <div className='absolute top-3 right-3 cursor-pointer' onClick={() => deleteExperience()}>
                <svg className='stroke-current text-card hover:text-red-700 duration-300' width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 3.8H2.33333M2.33333 3.8H13M2.33333 3.8V13.6C2.33333 13.9713 2.47381 14.3274 2.72386 14.5899C2.97391 14.8525 3.31304 15 3.66667 15H10.3333C10.687 15 11.0261 14.8525 11.2761 14.5899C11.5262 14.3274 11.6667 13.9713 11.6667 13.6V3.8M4.33333 3.8V2.4C4.33333 2.0287 4.47381 1.6726 4.72386 1.41005C4.97391 1.1475 5.31304 1 5.66667 1H8.33333C8.68696 1 9.02609 1.1475 9.27614 1.41005C9.52619 1.6726 9.66667 2.0287 9.66667 2.4V3.8M5.66667 7.3V11.5M8.33333 7.3V11.5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-5 w-full items-center gap-1 md:gap-3'>
                <h1 className='font-bold col-span-1'>Company</h1>
                <p className='text-[#7B7B7B] col-span-4 font-medium'>{experiences[0]?.company}</p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-5 w-full items-center gap-1 md:gap-3'>
                <h1 className='font-bold col-span-1'>Role</h1>
                <p className='text-[#7B7B7B] col-span-4 font-medium'>{experiences[0]?.role}</p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-5 w-full items-center gap-1 md:gap-3'>
                <h1 className='font-bold col-span-1'>Duration</h1>
                <p className='text-[#7B7B7B] col-span-4 font-medium'>{experiences[0]?.duration}</p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-5 w-full items-center gap-1 md:gap-3'>
                <h1 className='font-bold col-span-1'>Desc</h1>
                <p className='text-[#7B7B7B] col-span-4 font-medium'>{experiences[0]?.desc}</p>
            </div>
        </div>
    )
}

export default ExpCard