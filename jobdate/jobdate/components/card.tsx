'use client'

import { CardProps } from '@/utils/types';
import {
    motion,
    PanInfo,
    useMotionValue,
    useTransform,
} from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import SwipeButton from './swipeButtons';


const Card = ({ jobs, active, removeCard }: CardProps) => {
    const [isFullDetails, setIsFullDetails] = useState(false);

    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-25, 25]);
    const opacity = useTransform(x, [-200, -125, 0, 125, 200], [0, 1, 1, 1, 0]);
    const [exitX, setExitX] = useState(0);

    const dragEnd = (
        e: MouseEvent | TouchEvent | PointerEvent,
        info: PanInfo
    ) => {
        if (info.offset.x > 100) {
            setExitX(200);
            removeCard(jobs.jobs.id, 'right');
        } else if (info.offset.x < -100) {
            setExitX(-200);
            removeCard(jobs.jobs.id, 'left');
        }
    };

    return (
        <>
            {active ? (
                <motion.div
                    drag="x"
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    className={`${isFullDetails ? 'h-screen' : 'absolute top-52 z-30 flex max-h-[50%] min-h-[40%] sm:w-[75%] md:w-[65%] lg:w-[45%] xl:w-[35%] p-10 items-center justify-center self-center'} w-full duration-300`}
                    onDragEnd={dragEnd}
                    initial={{ scale: 0.95, opacity: 0.5 }}
                    animate={{
                        scale: 1.05,
                        opacity: 1,
                    }}
                    style={{ x, rotate, opacity }}
                    transition={{ type: 'tween', duration: 0.2, ease: 'easeIn' }}
                    whileDrag={{ cursor: 'grabbing' }}
                    exit={{ x: exitX }}
                >
                    <div className={`${isFullDetails ? 'h-screen w-full p-10 sm:p-12 lg:p-20' : 'mx-8 md:mx-0 overflow-y-hidden max-h-[70vh] rounded-[75px] border-[2.5px] border-card absolute px-8 md:px-10 py-12 lg:px-10 lg:py-14'} scrollCards font-kanit bg-foreground duration-300 overflow-scroll`}>

                        <div className={`${isFullDetails ? 'w-[35%] sm:w-[20%] md:w-[17%] lg:w-[15%]' : 'w-[30%]'} relative flex justify-center items-center overflow-hidden mx-auto`}>
                            <Image
                                src={jobs.jobs.logo_url}
                                alt=""
                                width={200} // aspect ratio width
                                height={1500}
                                layout='responsive'
                                style={{
                                    objectFit: 'cover',
                                }}
                            />
                        </div>

                        <hr className='h-px my-3 md:my-5 lg:my-6 mx-10 bg-[#727196] border-0 rounded' />

                        <div className="text-lg md:text-xl tracking-[2px] font-extrabold text-card">
                            <p>{jobs.jobs.role}</p>
                        </div>

                        <div className="text-sm font-extralight text-card">
                            <p>{jobs.jobs.company_name}</p>
                        </div>
                        <div className="mt-3 flex flex-wrap justify-center gap-1 md:gap-2 gap-y-2 text-xs font-light">
                            <p className="rounded-[20px] bg-btn-1 border-[1.5px] border-card px-4 py-[5px]">
                                {jobs.jobs.location}
                            </p>
                            <p className="rounded-[20px] bg-btn-2 border-[1.5px] border-card px-4 py-[5px]">
                                {jobs.jobs.salary_range[0]} - {jobs.jobs.salary_range[1]}$
                            </p>
                            <p className="rounded-[20px] bg-btn-3 border-[1.5px] border-card px-4 py-[5px]">
                                {jobs.jobs.work_type}
                            </p>
                        </div>


                        {
                            jobs.jobs.skillset && (
                                <h3 className='mt-3'>Skillset</h3>
                            )
                        }

                        {
                            jobs.jobs.skillset && (
                                <div className="mt-1 flex flex-col gap-[2px] text-sm font-light">
                                    {jobs.jobs.skillset.map((item, idx) => (
                                        <p key={idx} className="capitalize">
                                            - {item}
                                        </p>
                                    ))}
                                </div>
                            )
                        }

                        {
                            jobs.jobs.jd && (
                                <div className="mt-3 flex flex-col gap-[2px]">
                                    <h3>{jobs.jobs.jd.title}</h3>
                                    <div className={`${isFullDetails || 'fade-out'} text-sm font-light`}>
                                        {jobs.jobs.jd.content.map((item, idx) => (
                                            <p key={idx}>* {item}</p>))
                                        }
                                    </div>
                                </div>
                            )
                        }

                        <button
                            className="absolute bottom-10 right-10 bg-[#EEEEEE] border-[1px] border-[#47475B] text-white p-4 rounded-[22px]" onClick={() => setIsFullDetails(!isFullDetails)}
                        >
                            {isFullDetails ?
                                <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.83871 0.999999L5.83871 13M5.83871 13L11 8.07692M5.83871 13L1 8.07692" stroke="#47475B" stroke-linecap="round" />
                                </svg>
                                :
                                <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.16129 13V1M6.16129 1L1 5.92308M6.16129 1L11 5.92308" stroke="#47475B" stroke-linecap="round" />
                                </svg>
                            }
                        </button>
                    </div>
                </motion.div>
            ) : null}

            {jobs.jobs && <SwipeButton exit={setExitX} removeCard={removeCard} id={jobs.jobs.id} />}
        </>
    );
};

export default Card;