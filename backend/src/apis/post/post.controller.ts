import {Request, Response} from 'express';
import {
    deletePostByPostId,
    insertPost,
    Post, selectAllPosts, selectPostByPetId, selectPostByPostId


} from "./post.model"
import {Status} from '../../utils/interfaces/Status'
import {PostSchema} from "./post.validator";
import {zodErrorResponse} from "../../utils/response.utils";
import {PublicProfile} from "../profile/profile.model";
import {Pet, selectPetByPetId} from "../pet/pet.model";
import {z} from "zod";
import OpenAI from "openai";


export async function createPostController(request: Request, response: Response): Promise<Response | undefined> {
    try {
        const validationResult = PostSchema.safeParse(request.body)

        if (!validationResult.success) {
            return zodErrorResponse(response, validationResult.error)
        }
        console.log(validationResult.data)
        const {postCaption, postImageUrl, postPetId} = validationResult.data

        // To Do: Get PetModel by PetModel ID, make sure pet profileId matches profileId in Session

        const profile: PublicProfile = request.session.profile as PublicProfile

        const profileId: string = profile?.profileId

        const pet = await selectPetByPetId(postPetId)

        const petProfileId = pet?.petProfileId

        if (petProfileId !== profileId){
            return response.json({status: 401, message: 'This is not your PetModel!', data: null})

        }

        const post: Post = {
            postId: null,
            postPetId,
            postCaption,
            postImageUrl,
            postDatetime: null,
        }

        const result = await insertPost(post)

        const status: Status = {status: 200, message: result, data: null}
        return response.json(status)
    } catch (error) {
        console.log(error)
        return response.json({status: 500, message: 'Error creating PostModel. Try again', data: null})
    }
}

export async function getAllPosts (request: Request, response: Response): Promise<Response<Status>> {
    try {
        const data = await selectAllPosts()

        const status: Status = {status: 200, message: null, data}
        return response.json(status)
    } catch (error) {
        console.error(error)
        return response.json ({
            status: 500,
            message: 'Error getting all posts.',
            data: []
        })
    }
}

export async function getPostByPetIdController (request: Request, response: Response): Promise<Response<Status>> {
    try {
        const validationResult = z.string().uuid({message: 'Please provide a valid PostId'}).safeParse(request.params.petId)

        if (!validationResult.success) {
            return zodErrorResponse(response, validationResult.error)
        }

        const petId = validationResult.data

        const data = await selectPostByPetId(petId)
console.log(data)
        return response.json({status: 200, message: null, data})
    } catch (error) {
        return response.json({
            status: 500,
            message: 'post id not found',
            data: []
        })
    }
}
export async function getPostByPostIdController (request: Request, response: Response): Promise<Response<Status>> {
    try {
        const validationResult = z.string().uuid({message: 'Please provide a valid PostModel Id'}).safeParse(request.params.postId)

        if (!validationResult.success) {
            return zodErrorResponse(response, validationResult.error)
        }

        const postId = validationResult.data

        const data = await selectPostByPostId(postId)

        return response.json({status: 200, message: null, data})
    } catch (error) {
        return response.json({
            status: 500,
            message: 'post id not found',
            data: []
        })
    }
}


// export async function deletePostByPostIdController (request: Request, response: Response): Promise<Response<Status>> {
//     try {
//         const validationResult = z.string().uuid({message: 'Please provide a valid PostId'}).safeParse(request.params.postId)
//
//         if (!validationResult.success) {
//             return zodErrorResponse(response, validationResult.error)
//         }
//
//         const profile: PublicProfile = request.session.profile as PublicProfile
//
//         const profileId: string = profile.profileId as string
//
//         const postId = validationResult.data
//
//         const post = await selectPostByPostId(postId)
//         if (!post) {
//             return response.json({
//                 status: 403,
//                 message: 'No post with this ID',
//                 data: null
//             })
//         }
//         const pet = await selectPetByPetId(post.postPetId)
//
//         if (pet?.petProfileId !== profileId) {
//             return response.json({
//                 status: 403,
//                 message: 'You are not allowed to delete this pets post,',
//                 data: null
//             })
//         }
//
//         const result = await deletePostByPostId(postId)
//
//         return response.json({status: 200, message: "You did it!", data: null})
//
//
//     } catch (error) {
//         return response.json({
//             status: 500,
//             message: '',
//             data: []
//         })
//     }
// }

export async function deletePostByPostIdController(request: Request, response: Response): Promise<Response<Status>> {
    try {
        const validationResult = z.string().uuid({message: 'Please provide a valid PostId'}).safeParse(request.params.postId)

        if (!validationResult.success) {
            return zodErrorResponse(response, validationResult.error)
        }

        const profile: PublicProfile = request.session.profile as PublicProfile
        const profileId: string = profile.profileId as string
        const postId = validationResult.data

        const post = await selectPostByPostId(postId)
        if (!post) {
            return response.json({
                status: 403,
                message: 'No post with this ID',
                data: null
            })
        }
        const pet = await selectPetByPetId(post.postPetId)

        if (pet?.petProfileId !== profileId) {
            return response.json({
                status: 403,
                message: 'You are not allowed to delete this pets post.',
                data: null
            })
        }

        const result = await deletePostByPostId(postId)

        if (!result) {
            return response.status(500).json({
                status: 500,
                message: 'Failed to delete post',
                data: null
            })
        }

        // Return 204 No Content on successful deletion
        return response.status(204).send();
    } catch (error) {
        return response.json({
            status: 500,
            message: 'Server Error',
            data: []
        })
    }
}


export async function createPostWithAiController(request: Request, response: Response): Promise<Response | undefined> {
    try {
        const validationResult = PostSchema.safeParse(request.body)

        if (!validationResult.success) {
            return zodErrorResponse(response, validationResult.error)
        }

        const {postCaption, postImageUrl, postPetId} = validationResult.data

        // To Do: Get PetModel by PetModel ID, make sure pet profileId matches profileId in Session

        const profile: PublicProfile = request.session.profile as PublicProfile

        const profileId: string = profile?.profileId

        const pet = await selectPetByPetId(postPetId)

        const petProfileId = pet?.petProfileId

        if (petProfileId !== profileId){
            return response.json({status: 401, message: 'This is not your PetModel!', data: null})

        }
        if (!pet){
            return response.json({status: 401, message: 'This is not your PetModel!', data: null})

        }
        // const post: Post = {
        //     postId: null,
        //     postPetId,
        //     postCaption,
        //     postImageUrl,
        //     postDatetime: null,
        // }

        const openai = new OpenAI({
            apiKey: process.env.OPEN_AI_KEY,
        });

        const aiSuggestedCaption = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": `Imagine ${pet.petName}, a ${pet.petBreed}, ${pet.petSize}, with a ${pet.petPersonality} personality, is observing or interacting with the scene in the image. Write a fun, charming, or humorous caption that reflects their unique perspective, voice, and thoughts. Include their specific traits (such as being playful, lazy, curious, protective, etc.) and their way of expressing themselves. The caption should capture the pet's distinct voice, as though they were describing the moment in their own words.  Character limit max 128.  ${postCaption}`
                        }
                    ]
                }
            ]
        });



        //const result = await insertPost(post)
let data = aiSuggestedCaption?.choices[0]?.message?.content
        if (!data){
            return response.json({status:400, message: 'No result given from openAI'})
        }
        const status: Status = {status: 200, message: 'AI Suggested Caption', data};
        return response.json(status)
    } catch (error) {
        console.log(error)
        return response.json({status: 500, message: 'Error creating Ai suggestion  Try again', data: null})
    }
}

