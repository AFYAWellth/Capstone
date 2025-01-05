import ProfileTab from "@/components/ProfileTab";
import {PostCard} from "@/components/post-card/PostCard";
import {IoMdNotificationsOutline} from "react-icons/io";
import {GoPeople} from "react-icons/go";
import {FiHome} from "react-icons/fi";
import {IoMdSearch} from "react-icons/io";
import {FaRegBookmark} from "react-icons/fa6";
import {CiBookmark} from "react-icons/ci";
import Searchbar from "@/components/Searchbar";
import {NavTwo} from "@/components/NavTwo";
import {fetchAllPosts, fetchPostsByPet} from "@/utils/models/post/post.action";
import {LeftSideBar} from "@/components/LeftSideBar";
import {ProfileDropdownServer} from "@/app/profile-dropdown/ProfileDropdown.server";
import {fetchPostLike, getLikesByPostId} from "@/utils/models/like/like.action";
import {getSession} from "@/utils/session.utils";
import {redirect} from "next/navigation";
import {ConnectionsPanel} from "@/components/ConnectionsPanel";
import {PageProps} from "@/utils/interfaces/NextComponent";
import {fetchPetById, fetchPetsByFolloweeController} from "@/utils/models/pet/pet.action";
import {getCurrentPet} from "@/app/profile-dropdown/switch-pet.action";
import {FollowButton} from "@/app/(index)/pet-profile/[petId]/FollowButton";


export default async function ProfilePage(props:PageProps<{petId:string}>) {
    const petId=await props.params.petId

    const session = await getSession()
    if (!session){
        redirect("/sign-in")
    }
    const posts = await fetchPostsByPet(petId);
    const pet=await fetchPetById(petId);
//console.log(posts);
    let med = {width: 'w-1/3', position: 'right-1/3'};
    const currentPet = await getCurrentPet();

    const followees=await fetchPetsByFolloweeController(currentPet.petId)
    const isFollowing =followees.find(followPet=>pet.petId ===followPet.petId)
    const likes = await getLikesByPostId('b847f5ce-2939-4c12-93ba-6badbe15be0e')

    return (
        <>

            {/*<div className={"fixed z-10 w-screen"}><Nav/></div>*/}
            <div className="container bg-themeBackround flex-col md:flex-row ">


                <LeftSideBar/>
                <div id="mobile-view" className="h-fit w-screen bg-themeBackground flex flex-col py-20 md:hidden">
                    <NavTwo>
                        <ProfileDropdownServer/>
                    </NavTwo>
                    <div className={'container mx-auto flex  items-center pl-8'}>
                        <h1 className={"text-2xl mr-3"}>{pet.petName}</h1>
                        <FollowButton currentPetId={currentPet.petId} petId={pet.petId} isFollowing={!!isFollowing}/>
                    </div>
                    <div className="container mx-auto flex flex-col items-center pr-8">
                        {posts.map(post => <PostCard post={post} key={post.postId}/>)}
                    </div>

                </div>
                <div
                    className="middle hidden md:flex border-white border-2 md:bg-themeBackground md:w-1/3 md:flex-col md:absolute md:overflow-auto md:top-0 md:left-1/3 md:py-20">
                    <NavTwo>
                        <ProfileDropdownServer/>
                    </NavTwo>
                    <div className={'container mx-auto flex  items-center pr-8'}>
                        <h1 className={"text-2xl mr-3"}>{pet.petName}</h1>
                        <FollowButton currentPetId={currentPet.petId} petId={pet.petId} isFollowing={!!isFollowing}/>
                    </div>

                    {/*<div id={"label"} className={"bg-header w-full py-4 self-center mb-10"}>*/}
                    {/*    */}
                    {/*</div>*/}
                    <div className="container w-full pr-8">
                        {posts.map(post => <PostCard post={post} key={post.postId}/>)}
                    </div>

                </div>
                <ConnectionsPanel/>

            </div>

        </>
    )
}