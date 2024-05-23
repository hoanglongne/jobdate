import React from 'react'
import ProfileTag from '@/components/ProfileTag'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { countryData, skills } from '@/utils/data'
import ExpBar from '@/components/ExpBar'

const Profile = () => {
    return (
        <div className=' flex flex-col h-screen w-full p-6 mt-8 md:mt-0 md:p-8 text-card'>
            <div className='w-full relative'>
                <h1 className='absolute z-10 left-5 font-kanit text-profile font-bold text-5xl'>Your Profile</h1>
                <div className='z-0 bg-[#FFEEEE] border-2 border-profile p-7 mt-7 rounded-2xl'>
                    <p className='font-medium'>This is where to store and update your information, which will be use to gathering new job for you every day!  At cursus nunc amet ipsum in. Nunc nisi auctor.</p>
                </div>

                <div className='grid w-full grid-cols-2 lg:grid-cols-5 gap-y-6 gap-x-8 mt-12 px-2'>
                    <div className='col-span-2 md:col-span-4 lg:col-span-3'>
                        <ProfileTag name="Fullname">
                            <input type="text" className="bg-transparent focus:outline-none w-full" />
                        </ProfileTag>
                    </div>

                    <div className='col-span-2 md:col-span-2'>
                        <ProfileTag name="Role">
                            <input type="text" className="bg-transparent focus:outline-none w-full" />
                        </ProfileTag>
                    </div>

                    <div className='col-span-2 md:col-span-4 lg:col-span-3'>
                        <ProfileTag name="Worktype">
                            <RadioGroup className='space-x-1 md:space-x-3' defaultValue="onsite">
                                <div className="flex items-center space-x-1">
                                    <RadioGroupItem value="onsite" id="onsite" />
                                    <Label htmlFor="onsite">Onsite</Label>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <RadioGroupItem value="remote" id="remote" />
                                    <Label htmlFor="remote">Remote</Label>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <RadioGroupItem value="hydrid" id="hydrid" />
                                    <Label htmlFor="hydrid">Hydrid</Label>
                                </div>
                            </RadioGroup>

                        </ProfileTag>
                    </div>

                    <div className='col-span-2 md:col-span-2'>
                        <ProfileTag name="Number">
                            <input type="text" className="bg-transparent focus:outline-none w-full" />
                        </ProfileTag>
                    </div>

                    <div className='col-span-2 md:col-span-4 lg:col-span-3'>
                        <ProfileTag name="Location">
                            <Select>
                                <SelectTrigger className=" w-full">
                                    <SelectValue placeholder="Select your contry" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        countryData.map((country) => (
                                            <SelectItem key={country.code} value={country.code}>{country.name}</SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </ProfileTag>
                    </div>

                    <div className='col-span-2 md:col-span-5 xl:col-span-4'>
                        <ExpBar />
                    </div>

                    <div className='col-span-2 md:col-span-4 lg:col-span-3'>
                        <ProfileTag name="Location">
                            <Select>
                                <SelectTrigger className=" w-full">
                                    <SelectValue placeholder="Find and pick your skills" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        skills.map((skill) => (
                                            <SelectItem key={skill.value} value={skill.value}>{skill.label}</SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </ProfileTag>
                    </div>

                </div>
                <button className='bg-[#6E8C77] border-2 border-[#085820] text-foreground rounded-lg px-7 py-3 font-kanit mb-10 mt-6 ml-2'>Save Changes</button>
            </div>
        </div>
    )
}

export default Profile