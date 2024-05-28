'use client'

import React from 'react'
import { SheetClose } from './ui/sheet';
import { useRouter } from 'next/navigation';

const SmallScreenSideBar = () => {
    const router = useRouter();
    return (
        <SheetClose>
            <div className='flex flex-col gap-5 items-center'>
                <a onClick={() => { router.push('/protected') }}><h3 className='text-stroke'>Swipe</h3></a>

                <a onClick={() => { router.push('') }}><h3 className='text-stroke'>Application</h3></a>

                <a onClick={() => { router.push('/protected/profile') }}><h3 className='text-stroke'>Profile</h3></a>

                <a onClick={() => { router.push('/protected/settings') }}><h3 className='text-stroke'>Settings</h3></a>
            </div>
        </SheetClose>
    )
}

export default SmallScreenSideBar