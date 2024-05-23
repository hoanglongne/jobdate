'use client'
import Card from '@/components/card';
import { CardData } from '@/utils/types';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

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
        <div className="relative flex flex-col pt-28 h-screen w-full items-center justify-center overflow-hidden bg-background text-card">
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
