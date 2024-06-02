import { UUID } from 'crypto';
import { StaticImageData } from 'next/image';
import { SetStateAction } from 'react';

type TracksData = {
    name: string;
    artist: string;
    img: string;
};


export type CardData = {
    jobs: {
        id: string,
        jd: {
            title: string,
            content: string[]
        }, // Specify jd as JSON array type
        yoe: Number[],
        role: string,
        job_link: string,
        logo_url: string,
        skillset: string[],
        company_name: string,
        location: string,
        salary_range: string[],
        work_type: string,
        contract_type: string
    }
}

export type CardProps = {
    jobs: CardData;
    active: boolean;
    removeCard: (id: string, action: 'right' | 'left') => void;
};

export interface ExpBarProps {
    user: string;
}

export interface ExpCardProps {
    exp: {
        company: string;
        role: string;
        duration: string;
        desc: string;
    };
    index: number;
    deleteExperience: (idToDelete: number) => void;
};


export type SwipeButtonProps = {
    exit: (value: SetStateAction<number>) => void;
    removeCard: (id: string, action: 'right' | 'left') => void;
    id: string;
};