import React from 'react'
import ExpCard from './ExpCard'

const ExpBar = () => {
    return (
        <div className='relative'>
            <div className='border-[2.5px] font-kanit border-card px-4 max-w-[140px] rounded-b-none bg-foreground items-center rounded-xl text-profile font-bold py-2 shadow-profileBox'>
                <h1 className='text-center'>Experience</h1>
            </div>
            <div className='mt-[-2px] border-[2.5px] font-kanit border-card rounded-tl-none rounde-3xl p-6 w-full bg-foreground flex flex-col rounded-xl shadow-profileBox'>
                <ExpCard />
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