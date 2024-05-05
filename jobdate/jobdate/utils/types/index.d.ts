import { StaticImageData } from 'next/image';
import { SetStateAction } from 'react';

type TracksData = {
    name: string;
    artist: string;
    img: string;
};

export type CardData = {
    id: number;
    role: string;
    company: string;
    src: StaticImageData;
    bio: string;
    genre: string[];
};

export type CardProps = {
    data: CardData;
    active: boolean;
    removeCard: (id: number, action: 'right' | 'left') => void;
};

export type SwipeButtonProps = {
    exit: (value: SetStateAction<number>) => void;
    removeCard: (id: number, action: 'right' | 'left') => void;
    id: number;
};