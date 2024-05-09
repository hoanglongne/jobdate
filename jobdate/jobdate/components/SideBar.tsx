import Image from 'next/image'
import React from 'react'
import Logo from '../public/logo.png'
import Link from 'next/link';

const SideBar = ({ smallScreen }: { smallScreen: boolean }) => {

    return (
        <div className={`${smallScreen ? 'flex md:hidden w-full' : 'hidden md:flex border-r-[2.5px] border-black'} h-screen w-[400px] bg-sidebar flex-col items-center gap-10 font-lilitaOne text-xl lg:font-2xl`}>
            <div className='w-1/2 mt-5 flex justify-center'>
                <Image src={Logo} height={100} width={200} alt='Logo' />
            </div>

            <div className='flex flex-col gap-5 items-center'>
                <Link href=''><h3 className='text-stroke'>Swipe</h3></Link>
                <Link href=''><h3 className='text-stroke'>Application</h3></Link>
                <Link href=''><h3 className='text-stroke'>Profile</h3></Link>
                <Link href=''><h3 className='text-stroke'>Settings</h3></Link>
            </div>

            <div className='mb-10 mt-auto'>
                <Link href='protected/logout'>
                    <button className="text-sm py-2 px-5 text-[#47475B] border-2 border-[#47475B] rounded-md no-underline bg-[#d76666] hover:bg-[#c55555] transition duration-200">
                        Logout
                    </button>
                </Link>
            </div>
        </div>
    )
}


export default SideBar