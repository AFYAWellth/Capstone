'use server'
import {headers as incomingHeaders} from 'next/headers'
import {getSession} from "@/utils/session.utils";

export async function setHeaders() {
    const headers = new Headers()

    const session = await getSession()

    const authorization = session?.authorization
    if(authorization) {
        headers.append("authorization", authorization)
    }

    headers.append('Content-Type', 'application/json')
    const incomingHeadersObject = await incomingHeaders()

    const cookie = incomingHeadersObject.get('cookie')
    if (cookie){
        headers.append('cookie', cookie)
    }


    return headers
}

