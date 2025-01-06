'use server'
import {Post, PostSchema} from "@/utils/models/post/post.model";
import {setHeaders} from "@/utils/set-headers.utils";
import {SignUp} from "@/utils/models/sign-up/sign-up.model";
import {Status} from "@/utils/interfaces/Status";
import {getSession} from "@/utils/session.utils";
import {headers as incomingHeaders} from "next/dist/server/request/headers";


export async function fetchAllPosts(): Promise<Post[]> {
const {data} = await fetch(`${process.env.PUBLIC_API_URL}/apis/post`,{ //why is data in curly braces? destructure or obj?
    method: "get",
    headers: {
        'Content-Type': 'application/json'
    }
}).then((response) => {
    if (!response.ok) {
        throw new Error('Network response was not ok')
    } else {
        return response.json()
    }

})
return PostSchema.array().parse(data)
}

export async function fetchSavedPosts(profileId: string): Promise<Post[]> {
    const headers = await setHeaders()
    const response= await fetch(`${process.env.REST_API_URL}/apis/save/saveProfileId/${profileId}`, {
        method: "GET",
        headers
    }).then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok')

        }
        return response.json()
    }).catch((error) => {
        console.error(error)
        return[]
    })

return PostSchema.array().parse(response.data)
}

export async function fetchFolloweePosts(followeePetId: string): Promise<Post[]> {
    const headers = await setHeaders()
    const {data} = await fetch(`${process.env.REST_API_URL}/apis/follow/post/${followeePetId}`, {
        method: "GET",
        headers
    }).then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok')

        }
        return response.json()
    }).catch((error) => {
        console.error(error)
        return[]
    })
    return PostSchema.array().parse(data)
}

export async function preformCreatePost(post: Post): Promise<Status> {
    const headers = await setHeaders()

    return  fetch(`${process.env.REST_API_URL}/apis/post`, {
        method: "post",
        headers,
        body: JSON.stringify(post)
    }).then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        return response.json()
    }).catch((error) => {
        console.error(error)
        throw error
    })

}

export async function postImage(image: FormData): Promise<Status> {
    const headers = new Headers()

    const session = await getSession()

    const authorization = session?.authorization
    if(authorization) {
        headers.append("authorization", authorization)
    }

    const incomingHeadersObject = await incomingHeaders()

    const cookie = incomingHeadersObject.get('cookie')
    if (cookie){
        headers.append('cookie', cookie)
    }
    return fetch(`${process.env["REST_API_URL"]}/apis/image`,{
        headers,
        body: image,
        method: "post"
    }).then(response => {
        if(!response.ok){
            throw new Error('network response not ok')
        }
        return response.json()
    })

}

export async function fetchAiCaption(post: Post): Promise<Status> {
    const headers = await setHeaders()
    post.postImageUrl = null
    return  fetch(`${process.env.REST_API_URL}/apis/post/aiPost`, {
        method: "post",
        headers,
        body: JSON.stringify(post)
    }).then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        return response.json()
    }).catch((error) => {
        console.error(error)
        throw error
    })

}

export async function fetchPost(postId: string): Promise<Post | null> {
    const headers = await setHeaders()
    const {data} = await fetch(`${process.env.REST_API_URL}/apis/post/${postId}`, {
        method: "GET",
        headers
    }).then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        return response.json()
    })
    return PostSchema.nullable().parse(data)
}

export async function deletePost(postId: string): Promise<boolean> {
    const headers = await setHeaders(); // Assuming setHeaders() handles authentication/authorization, etc.

    const response = await fetch(`${process.env.REST_API_URL}/apis/post/${postId}`, {
        method: "DELETE",
        headers
    });

    if (!response.ok) {
        throw new Error('Failed to delete the post');
    }

    // If the server responds with a 204 status (No Content), this indicates success.
    return response.status === 204;
}

export async function fetchPostsByPet(petId:string): Promise<Post[]> {
    const {data} = await fetch(`${process.env.PUBLIC_API_URL}/apis/post/petId/${petId}`,{ //why is data in curly braces? destructure or obj?
        method: "get",
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok')
        } else {
            return response.json()
        }

    })
    return PostSchema.array().parse(data)
}
