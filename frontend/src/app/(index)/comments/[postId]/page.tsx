'use server'
import Searchbar from "@/components/Searchbar";
import CommentsPage from "@/app/(index)/comments/[postId]/CommentsPage";
import {PageProps} from "@/utils/interfaces/NextComponent";
import {fetchPost} from "@/utils/models/post/post.action";
import {redirect} from "next/navigation";
import {fetchCommentsByPostId} from "@/utils/models/comment/comment.action";


export default async function (props : PageProps<{postId:string}>) {
    const {postId} = await props.params
    const post = await fetchPost(postId)
    if (post === null) {
        redirect ('/')

    }
    const comments = await fetchCommentsByPostId(postId)
    //console.log(comments)
    let med = {width: 'w-1/3', position: 'left-1/3'};
    return (

        <>
 <Searchbar med={med}/>
<CommentsPage comments = {comments} post = {post}/>

        </>


    )
}