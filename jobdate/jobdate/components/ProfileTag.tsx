import React from 'react'

const ProfileTag = ({ name, children }: { name: string, children: React.ReactNode }) => {
    return (
        <div className='text-sm md:text-lg border-[2.5px] font-kanit border-card rounde-3xl px-4 py-6 w-full bg-foreground flex rounded-xl shadow-profileBox'>
            <div className='min-w-[80px] md:min-w-[100px] flex justify-center h-full text-profile font-bold half-bordered'>
                <h1>{name}</h1>
            </div>
            <div className='flex-1 px-4 flex items-center'>
                {children}
            </div>
        </div>
    )
}

export default ProfileTag