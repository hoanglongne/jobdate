'use client'
import Card from '@/components/card';
import { CardData } from '@/utils/types';
import { AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import decor1 from '@/public/decor1.svg';
import decor2 from '@/public/decor2.svg';
import decor3 from '@/public/decor3.svg';

export default function Swipe({ cardsData }: { cardsData: CardData[] }) {

    const [cards, setCards] = useState<CardData[]>(cardsData);
    const [activeIndex, setActiveIndex] = useState(cards.length - 1);
    const [rightSwipe, setRightSwipe] = useState(0);
    const [leftSwipe, setLeftSwipe] = useState(0);

    const removeCard = (id: string, action: 'right' | 'left') => {
        setCards((prev) => prev.filter((card) => card.jobs.id !== id));
        if (action === 'right') {
            setRightSwipe((prev) => prev + 1);
        } else {
            setLeftSwipe((prev) => prev + 1);
        }
        setActiveIndex((prev) => prev - 1);
    };
    return (
        <div className="relative flex flex-col h-screen w-full items-center justify-center overflow-hidden bg-background text-card">
            <div className='hidden lg:block absolute z-0 top-52 right-[120px]'>
                <Image src={decor1} alt='decor' />
            </div>
            <div className='hidden lg:block absolute z-0 top-20 left-[60px]'>
                <Image src={decor2} alt='decor' />
            </div>
            <div className='hidden lg:block absolute z-0 bottom-0 left-[-165px]'>
                <Image src={decor3} alt='decor' />
            </div>
            <AnimatePresence>
                {cards.length ? (
                    cards.map((card, index) => (
                        <Card
                            key={card.jobs.id}
                            jobs={card}
                            active={index === activeIndex}
                            removeCard={removeCard}
                        />
                    ))
                ) : (
                    <h2 className="absolute z-10 self-center text-center text-2xl font-bold text-card ">
                        That's all of the new jobs today
                        <br />
                        Come back tomorrow for more
                    </h2>
                )}
            </AnimatePresence>
        </div>
    );
}
