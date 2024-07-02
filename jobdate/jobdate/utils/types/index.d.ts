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
    experiences: Exp[],
    setValue: UseFormSetValue<{ number: string; fullname: string; role: string; work_type: "onsite" | "hydrid" | "remote"; location: string; exp: { role: string; company: string; duration: string; desc: string; }; skills: string; }>;
    form;
}

export interface ExpCardProps {
    exp: Exp
    index: number;
    deleteExperience: (idToDelete: number) => void;
    updateExperience: (updatedExp: Exp, index: number) => void;
    form;
};

export interface Exp {
    company: string;
    role: string;
    duration: string;
    desc: string;
}


export type SwipeButtonProps = {
    exit: (value: SetStateAction<number>) => void;
    removeCard: (id: string, action: 'right' | 'left') => void;
    id: string;
};