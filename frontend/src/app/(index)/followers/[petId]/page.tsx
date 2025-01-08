import {LeftSideBar} from "@/components/LeftSideBar";
import {PageProps} from "@/utils/interfaces/NextComponent";
import {fetchPetsByFollowersController} from "@/utils/models/pet/pet.action";
import React from "react";
import PetTab from "@/components/PetTab";



export default async function (props:PageProps<{petId:string}>) {
    const params = await props.params
    const petId = params.petId
    const followers = await fetchPetsByFollowersController(petId)



    const profiles = [
        {profileId: "1", imageUrl: "https://picsum.photos/400", profileName: "Mittens"},
        {profileId: "2", imageUrl: "https://picsum.photos/200", profileName: "Ruffles"},
        {profileId: "3", imageUrl: "https://picsum.photos/300", profileName: "Clancy"},
        {profileId: "4", imageUrl: "https://picsum.photos/500", profileName: "Wiley"},
        {profileId: "5", imageUrl: "https://picsum.photos/100", profileName: "Lemmy"},

    ]


    return (
        <>
            {/*    LEFT SIDE of the screen when in desktop view. This div is hidden when screen size small.  Display: flex when Md or larger*/}
            <LeftSideBar />

            {/*MOBILE VIEW. This div is hidden when screen size is Md or larger. Display: flex when Sm*/}

            <div id="mobile-view" className="h-full w-screen bg-themeBackground flex flex-col py-20 md:hidden">

                <div className="container mx-auto flex flex-col items-center pr-8">
                    {/*{posts.map(post => <PostCard post={post} pet={pets[0]} key={post.postId}/>)}*/}
                </div>
                <div className=" bg-themeBackground my-6 flex flex-col gap-6 items-center ">

                    <p className={"text-4xl font-bold"}>Followers</p>

                    {followers.map(follower => (<PetTab pet = {follower} key = {follower.petId} />))}

                </div>
            </div>

            {/*Following section portion of the screen when in desktop view. Hidden when screen size is Sm. Display: flex when Md or larger*/}

            <div
                className="md:flex min-h-dvh md:bg-themeBackground md:border-2 md:border-white md:w-2/3 md:flex-col md:absolute md:overflow-auto md:top-0 md:left-1/3 md:py-20">
                <div className="w-full bg-themeBackround my-6  flex flex-col gap-6 items-center justify-center">

                    <p className={"text-4xl"}>Followers</p>
                    {followers.map(follower => (<PetTab pet = {follower} key = {follower.petId} />))}

                </div>

            </div>

        </>
    )
}