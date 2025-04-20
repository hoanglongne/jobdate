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
import { set, z } from "zod"
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
    exp: z.object({
        company: z.string().min(2, { message: 'Company is required' }).max(70),
        role: z.string().min(2, { message: 'Role is required' }).max(50),
        duration: z.string().min(2, { message: 'Duration is required' }).max(50),
        desc: z.string().min(2, { message: 'Description is required' }).min(30),
    }).array(),
    // skills: z.array(z.string()).nonempty({ message: 'Skills are required' }),
    skills: z.string(),
    number: z.string().refine((value) => /^[+]{1}(?:[0-9-()/.]\s?){7,15}[0-9]{1}$/.test(value)),
})

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState("");
    const [updateStatus, setUpdateStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({
        type: null,
        message: ''
    });

    const supabase: SupabaseClient = createClient()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullname: "",
            role: "",
            work_type: "onsite",
            location: "",
            exp: [],
            skills: "",
            number: "",
        },
    })

    const { setValue } = form;
    const { watch } = form;
    const expValues = watch('exp');

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
                setValue('exp', data[0].exp);
            }
        }

        fetchProfile().then(() => setLoading(false));
    }, []);

    useEffect(() => {
        console.log(expValues);
    }, [expValues]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setUpdateStatus({ type: null, message: '' }); // Reset status

            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                setUpdateStatus({
                    type: 'error',
                    message: 'User not authenticated. Please log in again.'
                });
                return;
            }

            // First check if the user exists
            const { data: existingUser } = await supabase
                .from('users')
                .select()
                .eq('id', user.id)
                .single();

            let error;

            if (existingUser) {
                // Check if email is being used by another user
                const { data: emailCheck } = await supabase
                    .from('users')
                    .select('id')
                    .eq('email', user.email)
                    .neq('id', user.id)
                    .single();

                if (emailCheck) {
                    setUpdateStatus({
                        type: 'error',
                        message: 'This email is already being used by another account.'
                    });
                    return;
                }

                // Update existing user
                const { error: updateError } = await supabase
                    .from('users')
                    .update({
                        full_name: values.fullname,
                        email: user.email,
                        role: values.role,
                        work_type: values.work_type,
                        location: values.location,
                        skillset: values.skills,
                        number: values.number,
                        exp: values.exp || []
                    })
                    .eq('id', user.id);
                error = updateError;
            } else {
                // Check if email is already in use
                const { data: emailCheck } = await supabase
                    .from('users')
                    .select('id')
                    .eq('email', user.email)
                    .single();

                if (emailCheck) {
                    setUpdateStatus({
                        type: 'error',
                        message: 'This email is already being used by another account.'
                    });
                    return;
                }

                // Insert new user
                const { error: insertError } = await supabase
                    .from('users')
                    .insert({
                        id: user.id,
                        full_name: values.fullname,
                        email: user.email,
                        role: values.role,
                        work_type: values.work_type,
                        location: values.location,
                        skillset: values.skills,
                        number: values.number,
                        exp: values.exp || []
                    });
                error = insertError;
            }

            if (error) {
                console.error("Error updating profile:", error);
                if (error.code === '23505') { // Unique constraint violation
                    setUpdateStatus({
                        type: 'error',
                        message: 'This email is already being used by another account.'
                    });
                } else {
                    setUpdateStatus({
                        type: 'error',
                        message: 'Failed to update profile. Please try again.'
                    });
                }
                return;
            }

            setUpdateStatus({
                type: 'success',
                message: 'Profile updated successfully!'
            });
        } catch (error) {
            console.error("Unexpected error:", error);
            setUpdateStatus({
                type: 'error',
                message: 'An unexpected error occurred. Please try again.'
            });
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

                {/* Add status message */}
                {updateStatus.type && (
                    <div className={`mt-4 p-4 rounded-md ${updateStatus.type === 'success' ? 'bg-green-100 text-green-800 border border-green-400' :
                        'bg-red-100 text-red-800 border border-red-400'
                        }`}>
                        {updateStatus.message}
                    </div>
                )}

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
                                <ExpBar user={userId} experiences={expValues} setValue={setValue} form={form} />
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
                                                                        <SelectItem key={skill.name} value={skill.name}>{skill.code}</SelectItem>
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