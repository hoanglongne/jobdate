import Image from 'next/image'
import React from 'react'
import Logo from '../public/logo.png'
import AuthButton from "@/components/AuthButton";

import Link from 'next/link';

const SideBar = () => {

    return (
        <div className='hidden h-screen md:flex w-[400px] bg-sidebar flex-col items-center gap-10 lilitaOne text-xl lg:font-2xl border-r-[2.5px] border-black'>
            <div className='w-1/2 translate-x-[-12px] mt-5'>
                <Image src={Logo} height={100} width={200} alt='Logo' />
            </div>

            <div className='flex flex-col gap-5 items-center'>
                <Link href=''><h3 className='text-stroke'>Swipe</h3></Link>
                <Link href=''><h3 className='text-stroke'>Application</h3></Link>
                <Link href=''><h3 className='text-stroke'>Profile</h3></Link>
                <Link href=''><h3 className='text-stroke'>Settings</h3></Link>
            </div>

            <div className='mt-auto mb-10'>
                <AuthButton />
            </div>
        </div>
    )
}

export default SideBar