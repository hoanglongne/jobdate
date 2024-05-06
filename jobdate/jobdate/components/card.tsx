import { CardProps } from '@/utils/types';
import {
    motion,
    PanInfo,
    useMotionValue,
    useTransform,
} from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import SwipeButton from './swipeButtons';

const Card = ({ data, active, removeCard }: CardProps) => {
    const [exitX, setExitX] = useState(0);

    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-25, 25]);
    const opacity = useTransform(x, [-200, -125, 0, 125, 200], [0, 1, 1, 1, 0]);

    const dragEnd = (
        e: MouseEvent | TouchEvent | PointerEvent,
        info: PanInfo
    ) => {
        if (info.offset.x > 100) {
            setExitX(200);
            removeCard(data.id, 'right');
        } else if (info.offset.x < -100) {
            setExitX(-200);
            removeCard(data.id, 'left');
        }
    };

    return (
        <>
            {active ? (
                <motion.div
                    drag="x"
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    className="z-30 flex max-h-[50%] min-h-[40%] w-full p-10 items-center justify-center self-center"
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
                    <div className="scrollCards absolute overflow-y-scroll rounded-[75px] border-[2.5px] border-card bg-foreground px-8 md:px-10 py-12 lg:px-12 lg:py-14">
                        <div className="relative flex justify-center items-center w-[30%] overflow-hidden mx-auto">
                            <Image
                                src={data.src}
                                alt=""
                                width={100} // aspect ratio width
                                height={70}
                                layout='responsive'
                                style={{
                                    objectFit: 'cover',
                                }}
                            />
                        </div>

                        <hr className='h-px my-3 md:my-5 lg:my-6 mx-10 bg-[#727196] border-0 rounded' />

                        <div className="font-kanit text-lg md:text-xl tracking-[2px] font-extrabold text-card">
                            <p>{data.role}</p>
                        </div>

                        <div className="font-kanit text-sm font-extralight text-card">
                            <p>{data.company}</p>
                        </div>
                        <div className="mt-3 flex flex-wrap justify-center gap-1 md:gap-2 gap-y-2 text-xs md:text-sm font-extralight">
                            {data.tags.map((item, idx) => (
                                <p key={idx} className="rounded-[20px] bg-btn-1 border-[1.5px] border-card px-4 py-[5px]">
                                    {item}
                                </p>
                            ))}
                        </div>


                        {
                            data.skills && (
                                <h3 className='mt-4'>Skillset</h3>
                            )
                        }

                        {
                            data.skills && (
                                <div className="mt-3 flex flex-col gap-[2px] text-sm font-light">
                                    {data.skills.map((item, idx) => (
                                        <p key={idx} className="">
                                            - {item}
                                        </p>
                                    ))}
                                </div>
                            )
                        }

                        {
                            data.requirements && (
                                <h3 className='mt-4'>Requirement</h3>
                            )
                        }

                        {
                            data.requirements && (
                                <div className="mt-3 flex flex-col gap-[2px] text-sm font-light">
                                    {data.requirements.map((item, idx) => (
                                        <p key={idx} className="">
                                            - {item}
                                        </p>
                                    ))}
                                </div>
                            )
                        }

                        <button
                            className="absolute bottom-10 right-10 bg-[#EEEEEE] border-[1px] border-[#47475B] text-white p-4 rounded-[22px]"
                        >
                            <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.16129 13V1M6.16129 1L1 5.92308M6.16129 1L11 5.92308" stroke="#47475B" stroke-linecap="round" />
                            </svg>
                        </button>
                    </div>
                </motion.div>
            ) : null}

            <SwipeButton exit={setExitX} removeCard={removeCard} id={data.id} />
        </>
    );
};

export default Card;