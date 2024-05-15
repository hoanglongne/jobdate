import React from 'react'

const ExpCard = () => {
    return (
        <div className='border-[2.5px] border-card py-6 px-8 w-full bg-[#FFF9F4] flex flex-col items-center gap-2 rounded-xl text-card font-medium mb-5'>
            <div className='flex w-full items-center gap-3'>
                <h1 className='font-bold'>Company</h1>
                <p className='text-[#7B7B7B] font-medium'>Vietnam Telecom - Viettel</p>
            </div>
            <div className='flex w-full items-center gap-3'>
                <h1>Role</h1>
                <p className='text-[#7B7B7B] font-medium'>AI Engineer</p>
            </div>
            <div className='flex w-full items-center gap-3'>
                <h1>Duration</h1>
                <p className='text-[#7B7B7B] font-medium'>Mar 2022 - Jan 2023</p>
            </div>
            <div className='flex w-full items-center gap-3'>
                <h1>Desc</h1>
                <p className='text-[#7B7B7B] font-medium'>Lorem ipsum dolor sit amet consectetur. c. At cursus nunc amet ipsum in. Nunc nisi auctor.</p>
            </div>
        </div>
    )
}

export default ExpCard