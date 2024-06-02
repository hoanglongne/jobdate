import React from 'react'
import ExpCard from './ExpCard'
import { ExpBarProps } from '@/utils/types'
import { createClient } from '@/utils/supabase/client'
import { SupabaseClient } from '@supabase/supabase-js'
import { set } from 'zod'

const ExpBar: React.FC<ExpBarProps> = ({ user }) => {

    const supabase: SupabaseClient = createClient();
    const [experiences, setExperiences] = React.useState<any[]>([]);

    React.useEffect(() => {
        async function fetchExperiences() {
            const { data, error } = await supabase
                .from('users')
                .select('exp')
                .eq('id', user);
            if (error) {
                console.error('Error fetching experiences:', error);
                return;
            }
            setExperiences(data && data[0].exp);
        }

        fetchExperiences();
    }, []);

    console.log(experiences)

    const deleteExperience = async (idToDelete: any) => {
        if (!experiences || experiences.length === 0) {
            return;
        }
        // Remove the desired experience from the array
        const updatedExperiences = experiences.filter((_, index) => index !== idToDelete)

        // Update the array in the database
        let { error: updateError } = await supabase
            .from('users')
            .update({ exp: updatedExperiences })
            .eq('id', user); // replace with your actual user ID

        setExperiences(updatedExperiences);
        if (updateError) {
            console.error('Error updating experiences:', updateError);
            return;
        }
    };

    return (
        <div className='relative'>
            <div className='border-[2.5px] font-kanit border-card px-4 max-w-[140px] rounded-b-none bg-foreground items-center rounded-xl text-profile font-bold py-2 shadow-profileBox'>
                <h1 className='text-center'>Experience</h1>
            </div>
            <div className='mt-[-2px] border-[2.5px] font-kanit border-card rounded-tl-none rounde-3xl p-6 w-full bg-foreground flex flex-col rounded-xl shadow-profileBox'>
                {experiences?.map((exp, index) => (
                    <ExpCard key={index} exp={exp} index={index} deleteExperience={deleteExperience} />
                ))}
                <div className='w-full flex justify-center cursor-pointer'>
                    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="9.5" cy="9.5" r="9.5" fill="#6E8C77" />
                        <path d="M9.5 6V13M13 9.5L6 9.5" stroke="#FFF3E9" stroke-linecap="round" />
                    </svg>
                    <span className='ml-2 text-[#ADB9A9]'>Add New Exp</span>
                </div>
            </div>
        </div>
    )
}

export default ExpBar