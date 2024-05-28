import Image from 'next/image'
import React from 'react'
import Logo from '../public/logo.png'
import Link from 'next/link';
import SmallScreenSideBar from './SmallScreenSideBar';

const SideBar = ({ smallScreen }: { smallScreen: boolean }) => {
    return (
        <div className={`${smallScreen ? 'flex md:hidden w-full' : 'hidden md:flex border-r-[2.5px] border-[#806784] w-auto min-w-[260px]'} fixed h-screen bg-sidebar flex-col items-center gap-10 font-lilitaOne text-xl lg:font-2xl`}>
            <div className='w-1/2 mt-5 flex justify-center'>
                <Image src={Logo} height={100} width={200} alt='Logo' />
            </div>

            {smallScreen ?
                <SmallScreenSideBar />
                :
                <div className='flex flex-col gap-5 items-center'>
                    <Link href='/protected'><h3 className='text-stroke'>Swipe</h3></Link>
                    <Link href=''><h3 className='text-stroke'>Application</h3></Link>
                    <Link href='/protected/profile'><h3 className='text-stroke'>Profile</h3></Link>
                    <Link href='/protected/settings'><h3 className='text-stroke'>Settings</h3></Link>
                </div>
            }

            <div className='mb-10 mt-auto'>
                <Link href='/logout'>
                    <button className="text-sm font-kanit font-medium py-2 px-6 text-[#DB684F] border-2 border-[#F2A290] rounded-md no-underline bg-[#FFCFCF] hover:bg-[#ffc1c1] transition duration-200">
                        Logout
                    </button>
                </Link>
            </div>
        </div>
    )
}


export default SideBar