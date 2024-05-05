import { CardProps } from '@/utils/types';
import {
    easeIn,
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
    const input = [-200, 0, 200];
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
            <SwipeButton exit={setExitX} removeCard={removeCard} id={data.id} />
            {active ? (
                <motion.div
                    drag="x"
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    className="absolute z-30 flex h-screen min-w-[280px] w-[60%] md:w-[45%] lg:w-[35%] max-w-[500px] p-10 items-center justify-center self-center text-3xl font-bold"
                    onDragEnd={dragEnd}
                    initial={{ scale: 0.95, opacity: 0.5 }}
                    animate={{
                        scale: 1.05,
                        opacity: 1,
                    }}
                    style={{ x, rotate, opacity }}
                    transition={{ type: 'tween', duration: 0.3, ease: 'easeIn' }}
                    whileDrag={{ cursor: 'grabbing' }}
                    exit={{ x: exitX }}
                >
                    <div className="scrollCards absolute m-auto overflow-y-scroll rounded-[70px] border-[3px] border-card bg-foreground p-4 py-10 md:p-6 lg:p-10">
                        <div className="relative flex justify-center items-center w-full overflow-hidden rounded-b-xl">
                            <Image
                                src={data.src}
                                alt=""
                                height={70}
                                style={{
                                    objectFit: 'cover',
                                }}
                            />
                        </div>

                        <hr className='h-px my-8 bg-[#727196] border-0 rounded' />

                        <div className="mt-6 px-4 font-kanit text-lg md:text-xl tracking-[2px] font-extrabold text-card">
                            <p>{data.role}</p>
                        </div>

                        <div className="px-4 font-kanit text-lg font-extralight text-card">
                            <p>{data.company}</p>
                        </div>

                        <p className="mt-3 px-4 font-kanit text-lg font-light text-text-card">
                            {data.bio}
                        </p>

                        <div className="mt-3 flex gap-2 px-4 text-base font-extralight">
                            {data.genre.map((item, idx) => (
                                <p key={idx} className="rounded-[20px] bg-btn-1 border-2 border-card px-4 py-2">
                                    {item}
                                </p>
                            ))}
                        </div>

                    </div>
                </motion.div>
            ) : null}
        </>
    );
};

export default Card;