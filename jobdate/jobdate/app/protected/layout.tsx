import React from 'react'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SideBar from "@/components/SideBar";
const ProtectedLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <>
            <div className="absolute right-8 top-8 z-30 md:hidden">
                <Sheet>
                    <SheetTrigger>
                        <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 2H20M6.57143 8H16M2 14H20" stroke="#7B7B7B" stroke-width="2.5" stroke-linecap="round" />
                        </svg>
                    </SheetTrigger>
                    <SheetContent className="w-full p-0 border-0">
                        <SideBar smallScreen={true} />
                    </SheetContent>
                </Sheet>
            </div>
            <div className='w-screen h-screen flex'>
                <SideBar smallScreen={false} />
                <div className='hidden md:block h-screen w-auto min-w-[260px]' />
                {children}
            </div>
        </>
    )
}

export default ProtectedLayout