"use client"
import React, { useEffect, useState } from 'react'
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
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { createClient } from '@/utils/supabase/client'
import { SupabaseClient } from '@supabase/supabase-js'
import { Input } from "@/components/ui/input"


const formSchema = z.object({
    fullname: z.string().min(2, { message: 'Fullname is required' }).max(50),
    role: z.string().min(2, { message: 'role is required' }).max(50),
    work_type: z.enum(["onsite", "hydrid", "remote"], { message: 'Work type is required' }),
    location: z.string().max(50),
    // skills: z.array(z.string()).nonempty({ message: 'Skills are required' }),
    skills: z.string(),
    number: z.string().refine((value) => /^[+]{1}(?:[0-9-()/.]\s?){7,15}[0-9]{1}$/.test(value)),
})

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState("");

    const supabase: SupabaseClient = createClient()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullname: "",
            role: "",
            work_type: "onsite",
            location: "",
            skills: "",
            number: "",
        },
    })

    const { setValue } = form;

    useEffect(() => {
        async function fetchProfile() {

            const {
                data: { user },
            } = await supabase.auth.getUser();

            setUserId(user?.id as string);

            const { data } = await supabase.from('users').select().eq('id', user?.id);

            if (data && data[0]) {
                setValue('fullname', data[0].full_name);
                setValue('role', data[0].role);
                setValue('work_type', data[0].work_type);
                setValue('skills', data[0].skillset);
                setValue('number', data[0].number);
                setValue('location', data[0].location);
            }
        }

        fetchProfile().then(() => setLoading(false));
    }, []);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        const { error } = await supabase
            .from('users')
            .upsert({ full_name: values.fullname, email: user?.email, role: values.role, work_type: values.work_type, location: values.location, skillset: values.skills, number: values.number })

        if (error) {
            console.log(error);
        }
    }

    if (loading) {
        return <div className='font-kanit text-3xl text-card h-full w-full flex items-center justify-center'>Loading...</div>;
    }

    return (
        <div className=' flex flex-col h-screen w-full p-6 mt-8 md:mt-0 md:p-8 text-card'>
            <div className='w-full relative'>
                <h1 className='absolute z-10 left-5 font-kanit text-profile font-bold text-5xl'>Your Profile</h1>
                <div className='z-0 bg-[#FFEEEE] border-2 border-profile p-7 mt-7 rounded-2xl'>
                    <p className='font-medium'>This is where to store and update your information, which will be use to gathering new job for you every day!  At cursus nunc amet ipsum in. Nunc nisi auctor.</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className='grid w-full grid-cols-2 lg:grid-cols-5 gap-y-6 gap-x-8 mt-12 px-2'>

                            {/* //* Fullname */}
                            <div className='col-span-2 md:col-span-4 lg:col-span-3'>
                                <ProfileTag name="Fullname">
                                    <FormField
                                        control={form.control}
                                        name="fullname"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </ProfileTag>
                            </div>

                            {/* //* Role */}
                            <div className='col-span-2 md:col-span-2'>
                                <ProfileTag name="Role">
                                    <FormField
                                        control={form.control}
                                        name="role"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </ProfileTag>
                            </div>

                            {/* //* Worktype */}
                            <div className='col-span-2 md:col-span-4 lg:col-span-3'>
                                <ProfileTag name="Worktype">
                                    <FormField
                                        control={form.control}
                                        name="work_type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <RadioGroup onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <div className='space-x-1 md:space-x-3 flex'>
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
                                                        </div>
                                                    </FormControl>
                                                </RadioGroup>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                </ProfileTag>
                            </div>

                            {/* //* Number */}
                            <div className='col-span-2 md:col-span-2'>
                                <ProfileTag name="Number">
                                    <FormField
                                        control={form.control}
                                        name="number"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </ProfileTag>
                            </div>

                            {/* //* Location */}
                            <div className='col-span-2 md:col-span-4 lg:col-span-3'>
                                <ProfileTag name="Location">
                                    <FormField
                                        control={form.control}
                                        name="location"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Select onValueChange={field.onChange}>
                                                    <FormControl>
                                                        <div>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder={field.value || "Select Country"} />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {
                                                                    countryData.map((country) => (
                                                                        <SelectItem key={country.code} value={country.code}>{country.name}</SelectItem>
                                                                    ))
                                                                }
                                                            </SelectContent>
                                                        </div>
                                                    </FormControl>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </ProfileTag>
                            </div>

                            {/* //* Experience */}
                            <div className='col-span-2 md:col-span-5 xl:col-span-4'>
                                <ExpBar user={userId} />
                            </div>

                            {/* //* Skills */}
                            <div className='col-span-2 md:col-span-4 lg:col-span-3'>
                                <ProfileTag name="Skills">
                                    <FormField
                                        control={form.control}
                                        name="skills"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Select onValueChange={field.onChange}>
                                                    <FormControl>
                                                        <div>
                                                            <SelectTrigger className=" w-full">
                                                                <SelectValue placeholder={field.value || "Select Skills"} />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {
                                                                    skills.map((skill) => (
                                                                        <SelectItem key={skill.value} value={skill.value}>{skill.label}</SelectItem>
                                                                    ))
                                                                }
                                                            </SelectContent>
                                                        </div>
                                                    </FormControl>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </ProfileTag>
                            </div>

                        </div>
                        <button type="submit" className='bg-[#6E8C77] border-2 border-[#085820] text-foreground rounded-lg px-7 py-3 font-kanit mb-10 mt-6 ml-2'>Save Changes</button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default Profile