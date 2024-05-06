'use client'
import Card from '@/components/card';
import { CardData } from '@/utils/types';
import { cardData } from '@/utils/data';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function Dummy() {
    const [cards, setCards] = useState<CardData[]>(cardData);
    const [rightSwipe, setRightSwipe] = useState(0);
    const [leftSwipe, setLeftSwipe] = useState(0);

    const activeIndex = cards.length - 1;
    const removeCard = (id: number, action: 'right' | 'left') => {
        setCards((prev) => prev.filter((card) => card.id !== id));
        if (action === 'right') {
            setRightSwipe((prev) => prev + 1);
        } else {
            setLeftSwipe((prev) => prev + 1);
        }
    };
    return (
        <div className="relative flex flex-col pt-32 gap-6 h-screen w-full items-center justify-center overflow-hidden bg-background text-card">
            <AnimatePresence>
                {cards.length ? (
                    cards.map((card) => (
                        <Card
                            key={card.id}
                            data={card}
                            active={card.id === activeIndex}
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