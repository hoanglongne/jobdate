import AuthButton from '@/components/AuthButton'
import React from 'react'

const Logout = () => {
    return (
        <div className='flex justify-center items-center h-screen font-kanit '>
            <div className='flex-col bg-foreground rounded-3xl p-10 font-semibold border-[2.5px] border-card'>
                <AuthButton />
            </div>
        </div>
    )
}

export default Logout