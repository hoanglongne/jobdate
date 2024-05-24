'use client'

import React, { useState } from 'react'
import OptionButton from '@/components/OptionButton';
import { siteOptions } from '@/utils/data';
import ProfileTag from '@/components/ProfileTag';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { languageOptions, dataResistOptions } from '@/utils/data';

const Settings = () => {

    const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: boolean }>({});

    function handleClick(optionName: string) {
        setSelectedOptions({
            ...selectedOptions,
            [optionName]: !selectedOptions[optionName],
        });
    }

    return (
        <div className=' flex flex-col h-screen w-full p-6 mt-8 md:mt-0 md:p-8 text-card font-kanit'>
            <div className='w-full relative'>
                <h1 className='absolute z-10 left-5 text-profile font-bold text-5xl'>Settings</h1>
                <div className='z-0 bg-[rgb(255,238,238)] border-2 border-profile p-7 mt-7 rounded-2xl'>
                    <p className='font-light'>In this page you can setup your customized configurations like the stay duration of your fetched jobs, your password or which job sites to scrape.</p>
                </div>

                <div className='flex flex-col gap-5 mt-8 mb-16'>
                    <div className=''>
                        <div className='flex flex-col'>
                            <h1 className='font-extrabold text-2xl'>WHERE TO FIND JOBS</h1>
                            <p className='font-extralight'>We will only collect new jobs on the websites you choose to provide a customize experience</p>
                            <div className='grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 mr-10 lg:mr-14 xl:mr-20 gap-2 xl:gap-4 mt-5 gap-y-2 xl:gap-y-6'>
                                {siteOptions.map((option) => (
                                    <OptionButton key={option.name} option={option} onOptionClick={handleClick} selectedOptions={selectedOptions} />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-2 space-y-10 lg:space-y-0 mt-8'>
                        <div className='flex flex-col gap-5 pr-20'>
                            <h1 className='font-extrabold text-2xl'>MAIL NOTIFICATION</h1>
                            <ProfileTag name="Noti On">
                                <RadioGroup className='space-x-1 md:space-x-3' defaultValue="yes">
                                    <div className="flex items-center space-x-1">
                                        <RadioGroupItem value="yes" id="yes" />
                                        <Label htmlFor="yes">Yes</Label>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <RadioGroupItem value="no" id="no" />
                                        <Label htmlFor="no">No</Label>
                                    </div>
                                </RadioGroup>
                            </ProfileTag>
                        </div>
                        <div className='flex flex-col gap-5 pr-20'>
                            <h1 className='font-extrabold text-2xl'>APP LANGUAGE</h1>
                            <ProfileTag name="Language">
                                <Select>
                                    <SelectTrigger className=" w-full">
                                        <SelectValue placeholder="English" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            languageOptions.map((lang) => (
                                                <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                            </ProfileTag>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-2 space-y-10 lg:space-y-0 mt-8'>
                        <div className='flex flex-col col-span-1 gap-5 pr-20'>
                            <div>
                                <h1 className='font-extrabold text-2xl'>JOB RESIST</h1>
                                <p className='font-extralight'>For storage optimize purpose, we will remove your old fetched jobs, but we will let you choose how long your data stay.</p>
                            </div>
                            <ProfileTag name="Duration">2
                                <Select>
                                    <SelectTrigger className=" w-full">
                                        <SelectValue placeholder="15 days" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            dataResistOptions.map((time) => (
                                                <SelectItem key={time.value} value={time.value}>{time.label}</SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                            </ProfileTag>
                        </div>
                        <div className='flex md:justify-end md:items-end'>
                            <button className='bg-[#6E8C77] border-2 border-[#085820] text-foreground rounded-lg px-7 py-3 font-kanit lg:mr-20'>Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings