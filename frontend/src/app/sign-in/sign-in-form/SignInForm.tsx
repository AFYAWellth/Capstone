'use client'


import {Button, Label, TextInput} from "flowbite-react";
import {SignUpModal} from "@/app/sign-up/SignUpModal";
import {SignIn, SignInProfileSchema} from "@/utils/models/sign-in/sign-in.model";
import {preformSignIn} from "@/utils/models/sign-in/sign-in.action";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Status} from "@/utils/interfaces/Status";
import React from "react";
import {DisplayError} from "@/components/navigation/DisplayError";
import {DisplayStatus} from "@/components/navigation/DisplayStatus";
import {SignUpForm} from "@/app/sign-up/SignUpForm";
import Link from "next/link";
import {redirect} from "next/navigation";
import {useRouter} from "next/navigation";


export function SignInForm() {
const router = useRouter();
    const [status, setStatus] = React.useState<Status | null>(null)

    const defaultValues : SignIn = {
        profileEmail: '',
        profilePassword: ''
    }


    const fireServerAction = async (data: SignIn) => {
        try {
            const response = await preformSignIn(data)
           // console.log('Response:', response);


            if(response.status === 200) {
                reset()
                router.push('/choose-pet')
            }
            setStatus(response)
        } catch (error) {
            setStatus({status: 500, message: 'Internal Server Error try again later', data: undefined})
            console.error(error)
        }
    }





    const {register, handleSubmit, control, reset, formState: {errors}} = useForm<SignIn>({
        resolver: zodResolver(SignInProfileSchema),
        defaultValues,
        mode: 'onBlur'
    })

    return(
        <>
            <div className="flex flex-col justify-center">
                <div>
                    <br/><br/><br/><br/>
                </div>

            <img src="/talking-pet-logo-new.png" alt="PetModel Logo" className="login-logo mx-auto"/>
            <form onSubmit={handleSubmit(fireServerAction)} className="flex  flex-col mx-auto gap-4">
                <h1 className="text-3xl font-bold">Welcome back.</h1>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="email1" value="Your email"/>
                    </div>
                    <TextInput
                        id="email1"
                        type="email"

                        {...register('profileEmail')}
                        aria-invalid={errors.profileEmail ? true : false}
                    />
                    <DisplayError error={errors.profileEmail?.message}/>
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="password1" value="Your password"/>
                    </div>
                    <TextInput
                        id="password1"
                        type="password"
                        {...register('profilePassword')}
                    />
                    <DisplayError error={errors.profilePassword?.message}/>
                </div>
                <Link href={"/sign-up"}>Don't have an account?</Link>
                <Button type="submit" className="">Submit</Button>
            </form>

            </div>
            <DisplayStatus status={status}/>
        </>
    )
}