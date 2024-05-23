'use client'

import { SwipeButtonProps } from '@/utils/types';
import { useEffect } from 'react';

export default function SwipeButton({
    exit,
    removeCard,
    id,
}: SwipeButtonProps) {


    const handleSwipe = (action: 'left' | 'right') => {
        if (action === 'left') {
            exit(-200);
        } else if (action === 'right') {
            exit(200);
        }
        removeCard(id, action);
    };
    return (
        <div className="flex items-center space-x-8 absolute bottom-0 mb-16 z-40">
            <button
                onClick={() => handleSwipe('left')}
                className="relative w-20 h-20 overflow-visible bg-[#E75B5B] rounded-full z-10 transform hover:scale-105 duration-200"
            >
                <span className="absolute z-0 w-full h-full border-2 border-black rounded-full translate-x-[-3%] translate-y-[-53%] flex justify-center items-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 20.5714H3.42857V24H0V20.5714Z" fill="black" />
                        <path d="M3.42857 17.1429H6.85714V20.5714H3.42857V17.1429Z" fill="black" />
                        <path d="M6.85714 13.7143H10.2857V17.1429H6.85714V13.7143Z" fill="black" />
                        <path d="M10.2857 10.2857H13.7143V13.7143H10.2857V10.2857Z" fill="black" />
                        <path d="M13.7143 13.7143H17.1429V17.1429H13.7143V13.7143Z" fill="black" />
                        <path d="M17.1429 17.1429H20.5714V20.5714H17.1429V17.1429Z" fill="black" />
                        <path d="M20.5714 20.5714H24V24H20.5714V20.5714Z" fill="black" />
                        <path d="M6.85714 6.85714H10.2857V10.2857H6.85714V6.85714Z" fill="black" />
                        <path d="M3.42857 3.42857H6.85714V6.85714H3.42857V3.42857Z" fill="black" />
                        <path d="M0 0H3.42857V3.42857H0V0Z" fill="black" />
                        <path d="M13.7143 6.85714H17.1429V10.2857H13.7143V6.85714Z" fill="black" />
                        <path d="M17.1429 3.42857H20.5714V6.85714H17.1429V3.42857Z" fill="black" />
                        <path d="M20.5714 0H24V3.42857H20.5714V0Z" fill="black" />
                    </svg>
                </span>
            </button>

            <button
                onClick={() => handleSwipe('right')}
                className="relative w-20 h-20 overflow-visible bg-[#B0E3A3] rounded-full z-10 transform hover:scale-105 duration-200"
            >
                <span className="absolute z-0 w-full h-full border-2 border-black rounded-full translate-x-[3%] translate-y-[-47%] flex justify-center items-center"><svg width="33" height="27" viewBox="0 0 33 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.79661 0H13.9831V11.5714H2.79661V0Z" fill="black" />
                    <path d="M19.017 0H30.2034V11.5714H19.017V0Z" fill="black" />
                    <path d="M11.1864 2.7551H22.3729V14.3265H11.1864V2.7551Z" fill="black" />
                    <path d="M0 2.7551H11.1864V13.7755H0V2.7551Z" fill="black" />
                    <path d="M2.79661 8.26531H13.9831V19.2857H2.79661V8.26531Z" fill="black" />
                    <path d="M8.38983 13.2245H19.5763V24.2449H8.38983V13.2245Z" fill="black" />
                    <path d="M13.9831 13.2245H25.1695V24.2449H13.9831V13.2245Z" fill="black" />
                    <path d="M13.4237 15.9796H19.5763V27H13.4237V15.9796Z" fill="black" />
                    <path d="M19.5763 8.26531H30.7627V19.2857H19.5763V8.26531Z" fill="black" />
                    <path d="M21.8136 2.7551H33V13.7755H21.8136V2.7551Z" fill="black" />
                </svg>

                </span>
            </button>

        </div>
    );
}