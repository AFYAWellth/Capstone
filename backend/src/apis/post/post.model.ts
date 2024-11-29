import {z} from 'zod'
import {PostSchema} from "./post.validator";
import {sql} from "../../utils/database.utils";
import {Pet} from "../pet/pet.model";
import {PetSchema} from "../pet/pet.validator";

export type Post = z.infer<typeof PostSchema>;

export async function insertPost(post: Post): Promise<string> {
    const {postId, postPetId, postCaption, postImageUrl} = post

    await sql`INSERT INTO post (post_id, post_pet_id, post_caption, post_image_url, post_datetime)
              VALUES (gen_random_uuid(), ${postPetId}, ${postCaption}, ${postImageUrl}, now())`

    return 'Post Successfully Created'
}

export async function selectAllPosts(): Promise<Post[]> {
    const rowList = <Post[]>await sql`SELECT post_id,
                                             post_pet_id,
                                             post_caption,
                                             post_image_url,
                                             post_datetime
                                      FROM post
                                      ORDER BY post_datetime DESC`

    return PostSchema.array().parse(rowList)
}

export async function selectPostByPetId(postPetId: string): Promise<Post[]> {
    const rowList = <Post[]>await sql`SELECT post_id,
                                             post_pet_id,
                                             post_caption,
                                             post_image_url,
                                             post_datetime
                                      FROM post
                                      WHERE post_pet_id = ${postPetId}`

    return PostSchema.array().parse(rowList)
}

export async function selectPostByPostId(postId: string): Promise<Post | null> {
    const rowList = <Post[]>await sql`SELECT post_id,
                                             post_pet_id,
                                             post_caption,
                                             post_image_url,
                                             post_datetime
                                      FROM post
                                      WHERE post_id = ${postId}`

    const result = PostSchema.array().parse(rowList)

    return result.length === 0 ? null : result[0]
}

export async function deletePostByPostId(postId: string): Promise<string> {
    await sql`DELETE
              FROM post
              WHERE post_id = ${postId}`

    return 'Post Successfully Deleted'
}