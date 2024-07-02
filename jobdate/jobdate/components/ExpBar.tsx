import React, { useEffect } from 'react'
import ExpCard from './ExpCard'
import { Exp, ExpBarProps } from '@/utils/types'
import { createClient } from '@/utils/supabase/client'
import { SupabaseClient } from '@supabase/supabase-js'


const ExpBar: React.FC<ExpBarProps> = ({ user, experiences, setValue, form }) => {
    const supabase: SupabaseClient = createClient();

    const handleDelete = async (idToDelete: number) => {
        if (!experiences) return;
        const updatedExperiences = experiences.filter((_, index) => index !== idToDelete);
        await supabase.from('users').update({ exp: updatedExperiences }).eq('id', user);
        setValue("exp", updatedExperiences);
    };

    const handleUpdate = async (updatedExp: Exp, index: number) => {
        if (!experiences || index < 0 || index >= experiences.length) return;
        const updatedExperiences = [...experiences];
        updatedExperiences[index] = updatedExp;
        await supabase.from('users').update({ exp: updatedExperiences }).eq('id', user);
        setValue("exp", updatedExperiences);
    };

    useEffect(() => {
        console.log(experiences)
    }, [experiences, setValue]);

    return (
        <div className='relative'>
            <div className='border-[2.5px] font-kanit border-card px-4 max-w-[140px] rounded-b-none bg-foreground items-center rounded-xl text-profile font-bold py-2 shadow-profileBox'>
                <h1 className='text-center'>Experience</h1>
            </div>
            <div className='mt-[-2px] border-[2.5px] font-kanit border-card rounded-tl-none rounde-3xl p-6 w-full bg-foreground flex flex-col rounded-xl shadow-profileBox'>
                {experiences?.map((exp, index) => (
                    <ExpCard key={index} exp={exp} index={index}
                        deleteExperience={() => handleDelete(index)}
                        updateExperience={(updatedExp: Exp) => handleUpdate(updatedExp, index)}
                        form={form}
                    />
                ))}
                <div className='w-full flex justify-center cursor-pointer'>
                    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="9.5" cy="9.5" r="9.5" fill="#6E8C77" />
                        <path d="M9.5 6V13M13 9.5L6 9.5" stroke="#FFF3E9" strokeLinecap="round" />
                    </svg>
                    <span className='ml-2 text-[#ADB9A9]'>Add New Exp</span>
                </div>
            </div>
        </div>
    )
}

export default ExpBar