'use client'
import React, { useState } from 'react'
import { ExpCardProps } from '@/utils/types'

const ExpCard: React.FC<ExpCardProps> = ({ exp, deleteExperience, index, form }) => {
    // const [company, setCompany] = useState(exp?.company);
    // const [role, setRole] = useState(exp?.role);
    // const [duration, setDuration] = useState(exp?.duration);
    // const [desc, setDesc] = useState(exp?.desc);
    const [isEditing, setIsEditing] = useState(false);
    const { register } = form


    return (
        <div className='relative border-[2.5px] border-card py-6 px-3 md:px-4 lg:px8 w-full bg-[#FFF9F4] flex flex-col items-center gap-5 md:gap-2 rounded-xl text-card font-medium mb-5 duration-500'>
            <div className='absolute top-3 right-3 cursor-pointer flex gap-2 items-center'>
                {!isEditing &&
                    <svg onClick={() => setIsEditing(true)} className='stroke-current stroke-[1.5px] text-card hover:text-green-700 duration-300' width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.8344 1.6267C11.0066 1.42801 11.211 1.2704 11.436 1.16287C11.661 1.05534 11.9021 1 12.1456 1C12.3891 1 12.6303 1.05534 12.8553 1.16287C13.0802 1.2704 13.2847 1.42801 13.4569 1.6267C13.6291 1.82538 13.7657 2.06126 13.8588 2.32086C13.952 2.58045 14 2.85869 14 3.13968C14 3.42066 13.952 3.6989 13.8588 3.95849C13.7657 4.21809 13.6291 4.45397 13.4569 4.65266L4.60593 14.8653L1 16L1.98344 11.8393L10.8344 1.6267Z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                }
                {isEditing &&
                    <svg onClick={() => setIsEditing(false)} className='stroke-current text-card hover:text-red-700 duration-300' width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5.5 6M10 11L5.5 6M5.5 6L10 1M5.5 6L1 11" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                }
                <svg onClick={() => deleteExperience(index)} className='stroke-current text-card hover:text-red-700 duration-300' width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 3.8H2.33333M2.33333 3.8H13M2.33333 3.8V13.6C2.33333 13.9713 2.47381 14.3274 2.72386 14.5899C2.97391 14.8525 3.31304 15 3.66667 15H10.3333C10.687 15 11.0261 14.8525 11.2761 14.5899C11.5262 14.3274 11.6667 13.9713 11.6667 13.6V3.8M4.33333 3.8V2.4C4.33333 2.0287 4.47381 1.6726 4.72386 1.41005C4.97391 1.1475 5.31304 1 5.66667 1H8.33333C8.68696 1 9.02609 1.1475 9.27614 1.41005C9.52619 1.6726 9.66667 2.0287 9.66667 2.4V3.8M5.66667 7.3V11.5M8.33333 7.3V11.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>


            <div className='grid grid-cols-1 md:grid-cols-5 w-full items-center gap-1 md:gap-3'>
                <h1 className='font-bold col-span-1'>Company</h1>
                <input disabled={!isEditing} className='text-[#7B7B7B] col-span-3 font-medium bg-transparent focus:outline-none'
                    {...register(`exp.${index}.company`)} />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-5 w-full items-center gap-1 md:gap-3'>
                <h1 className='font-bold col-span-1'>Role</h1>
                <input disabled={!isEditing} className='text-[#7B7B7B] col-span-3 font-medium bg-transparent focus:outline-none'
                    {...register(`exp.${index}.role`)} />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-5 w-full items-center gap-1 md:gap-3'>
                <h1 className='font-bold col-span-1'>Duration</h1>
                <input disabled={!isEditing} className='text-[#7B7B7B] col-span-3 font-medium bg-transparent focus:outline-none'
                    {...register(`exp.${index}.duration`)} />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-5 w-full items-center gap-1 md:gap-3'>
                <h1 className='font-bold col-span-1'>Desc</h1>
                <textarea disabled={!isEditing} className='text-[#7B7B7B] col-span-3 font-medium bg-transparent focus:outline-none h-20'
                    {...register(`exp.${index}.desc`)} />
            </div>

            {isEditing && <button className='self-end mr-3 bg-profile px-5 py-2 rounded-lg text-[#f5f5f5] hover:text-white font-medium text-sm hover:translate-x-[-1px] hover:translate-y-[-1px] hover:scale-[103%] duration-300' type="submit">Update</button>}
        </div>
    );
}

export default ExpCard