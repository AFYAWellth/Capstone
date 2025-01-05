'use server'

import { SignIn } from './sign-in.model';
import {cookies, headers} from "next/headers";

export async function preformSignIn(signIn: SignIn) {

    const response : Response = await fetch(`${process.env.PUBLIC_API_URL}/apis/sign-in`, {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(signIn)
    })

    const authorization = response.headers.get("authorization")


    const cookie = response.headers.getSetCookie()

    const cookieJar = await cookies()
    const parseCookie = (str: string): Record<string, string> =>
        str.split(';') // Split the string into individual cookie parts
            .map(cookie => cookie.split('=')) // Split each part into key and value
            .filter(pair => pair.length === 2) // Ensure only valid key-value pairs are processed
            .reduce((acc: Record<string, string>, [key, value]) => {
                acc[decodeURIComponent(key.trim())] = decodeURIComponent(value.trim());
                return acc;
            }, {});

    if (cookie[0]){
        const session = parseCookie(cookie[0])

        cookieJar.set('connect.sid', session['connect.sid'], {path:session.path, sameSite:'lax', httpOnly: true})
    }
    if (authorization) {


        cookieJar.set("earl-grey", authorization, {path: "/", sameSite:"strict", httpOnly: true, maxAge:10_800})
    }

    return response.json().then((response) => {

        return response
    }).catch((error) => {
        console.error(error)
        throw error
    })

}



