'use client'

import React, { useState, useEffect } from 'react'
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
import { createClient } from '@/utils/supabase/client';
import { SupabaseClient } from '@supabase/supabase-js';

const Settings = () => {
    const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: boolean }>({});
    const [notificationEnabled, setNotificationEnabled] = useState<string>("yes");
    const [language, setLanguage] = useState<string>("english");
    const [retention, setRetention] = useState<string>("15days");
    const [loading, setLoading] = useState(true);
    const [updateStatus, setUpdateStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({
        type: null,
        message: ''
    });

    const supabase: SupabaseClient = createClient();

    useEffect(() => {
        async function loadSettings() {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    setUpdateStatus({
                        type: 'error',
                        message: 'User not authenticated'
                    });
                    return;
                }

                const { data: settings, error } = await supabase
                    .from('user_settings')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (error) {
                    console.error('Error loading settings:', error);
                    return;
                }

                if (settings) {
                    const sitesObject = settings.job_sites.reduce((acc: any, site: string) => {
                        acc[site] = true;
                        return acc;
                    }, {});

                    setSelectedOptions(sitesObject);
                    setNotificationEnabled(settings.notification_enabled ? "yes" : "no");
                    setLanguage(settings.app_language);
                    setRetention(settings.job_data_retention);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        }

        loadSettings();
    }, []);

    function handleClick(optionName: string) {
        setSelectedOptions({
            ...selectedOptions,
            [optionName]: !selectedOptions[optionName],
        });
    }

    async function handleSave() {
        try {
            setUpdateStatus({ type: null, message: '' });

            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setUpdateStatus({
                    type: 'error',
                    message: 'User not authenticated'
                });
                return;
            }

            const selectedSites = Object.entries(selectedOptions)
                .filter(([_, selected]) => selected)
                .map(([site]) => site);

            const { error } = await supabase
                .from('user_settings')
                .upsert({
                    user_id: user.id,
                    job_sites: selectedSites,
                    notification_enabled: notificationEnabled === "yes",
                    app_language: language,
                    job_data_retention: retention
                }, {
                    onConflict: 'user_id'
                });

            if (error) {
                console.error('Error saving settings:', error);
                setUpdateStatus({
                    type: 'error',
                    message: 'Failed to save settings'
                });
                return;
            }

            setUpdateStatus({
                type: 'success',
                message: 'Settings saved successfully!'
            });
        } catch (error) {
            console.error('Error:', error);
            setUpdateStatus({
                type: 'error',
                message: 'An unexpected error occurred'
            });
        }
    }

    if (loading) {
        return <div className='font-kanit text-3xl text-card h-full w-full flex items-center justify-center'>Loading...</div>;
    }

    return (
        <div className='flex flex-col h-screen w-full p-6 mt-8 md:mt-0 md:p-8 text-card font-kanit'>
            <div className='w-full relative'>
                <h1 className='absolute z-10 left-5 text-profile font-bold text-5xl'>Settings</h1>
                <div className='z-0 bg-[rgb(255,238,238)] border-2 border-profile p-7 mt-7 rounded-2xl'>
                    <p className='font-light'>In this page you can setup your customized configurations like the stay duration of your fetched jobs, your password or which job sites to scrape.</p>
                </div>

                {updateStatus.type && (
                    <div className={`mt-4 p-4 rounded-md ${updateStatus.type === 'success' ? 'bg-green-100 text-green-800 border border-green-400' :
                        'bg-red-100 text-red-800 border border-red-400'
                        }`}>
                        {updateStatus.message}
                    </div>
                )}

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
                                <RadioGroup
                                    className='space-x-1 md:space-x-3'
                                    value={notificationEnabled}
                                    onValueChange={setNotificationEnabled}
                                >
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
                                <Select value={language} onValueChange={setLanguage}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="English" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {languageOptions.map((lang) => (
                                            <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                                        ))}
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
                            <ProfileTag name="Duration">
                                <Select value={retention} onValueChange={setRetention}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="15 days" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {dataResistOptions.map((time) => (
                                            <SelectItem key={time.value} value={time.value}>{time.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </ProfileTag>
                        </div>
                        <div className='flex md:justify-end md:items-end'>
                            <button
                                onClick={handleSave}
                                className='bg-[#6E8C77] border-2 border-[#085820] text-foreground rounded-lg px-7 py-3 font-kanit lg:mr-20'
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings