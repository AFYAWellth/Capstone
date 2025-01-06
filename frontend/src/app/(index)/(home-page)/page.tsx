
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
import {fetchAllPosts} from "@/utils/models/post/post.action";
import {LeftSideBar} from "@/components/LeftSideBar";
import {ProfileDropdownServer} from "@/app/profile-dropdown/ProfileDropdown.server";
import {fetchPostLike, getLikesByPostId} from "@/utils/models/like/like.action";
import {getSession} from "@/utils/session.utils";
import {redirect} from "next/navigation";
import {ConnectionsPanel} from "@/components/ConnectionsPanel";


export default async function HomePage() {


    const session = await getSession()
    if (!session){
        redirect("/sign-in")
    }
    const posts = await fetchAllPosts();


    // const profiles = [
    //     {profileId: "1", imageUrl: "https://picsum.photos/400", profileName: "Mittens"},
    //     {profileId: "2", imageUrl: "https://picsum.photos/200", profileName: "Ruffles"},
    //     {profileId: "3", imageUrl: "https://picsum.photos/300", profileName: "Clancy"},
    //     {profileId: "4", imageUrl: "https://picsum.photos/500", profileName: "Wiley"},
    //     {profileId: "5", imageUrl: "https://picsum.photos/100", profileName: "Lemmy"},
    //
    // ]
    let med = {width: 'w-1/3', position: 'right-1/3'};

    //const likes = await getLikesByPostId('b847f5ce-2939-4c12-93ba-6badbe15be0e')
//console.log(likes)

    return (
        <>

            {/*<div className={"fixed z-10 w-screen"}><Nav/></div>*/}
            <div className="container bg-themeBackround flex-col md:flex-row ">


                <LeftSideBar/>
                <div id="mobile-view" className="h-fit w-screen bg-themeBackground flex flex-col py-20 md:hidden">
                    <NavTwo>
                        <ProfileDropdownServer/>
                    </NavTwo>


                    <div className="container mx-auto flex flex-col items-center pr-8">
                        {posts.map(post => <PostCard post={post} key={post.postId}/>)}
                    </div>

                </div>
                <div
                    className="middle hidden md:flex border-white border-2 md:bg-themeBackground md:w-1/3 md:flex-col md:absolute md:overflow-auto md:top-0 md:left-1/3 md:py-20">
                    <NavTwo>
                        <ProfileDropdownServer/>
                    </NavTwo>

                    {/*<div id={"label"} className={"bg-header w-full py-4 self-center mb-10"}>*/}
                    {/*    */}
                    {/*</div>*/}
                    <div className="container w-full pr-8">
                        {posts.map(post => <PostCard post={post}  key={post.postId}/> )}
                    </div>

                </div>
<ConnectionsPanel />

            </div>

        </>
    )
}