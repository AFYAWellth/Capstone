"use client";
import { MdDelete } from "react-icons/md";  // Import trash icon
import { deletePost } from "@/utils/models/post/post.action";

type Props = {
    postId: string;
};

export function DeleteButton(props: Props) {
    const { postId } = props;

    const handleClick = async () => {
        // Confirm before deletion
        if (!window.confirm("Are you sure you want to delete this post?")) {
            return;
        }

        // Perform the deletion
        const status = await deletePost(postId);

        if (status) {
            // Reload the page to reflect updated data
            window.location.reload();  // Reload the page to fetch the latest posts
        } else {
            alert("An error occurred while deleting the post.");
        }
    };

    return (
        <MdDelete
            onClick={handleClick}
            className="cursor-pointer text-red-500"
        />
    );
}
