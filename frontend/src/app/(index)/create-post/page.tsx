'use server'
import {Button} from "flowbite-react";
import {InputText} from "@/app/(index)/create-post/inputtext";
import ProfileTab from "@/components/ProfileTab"
import {ProfileDropdown} from "@/app/profile-dropdown/ProfileDropdown";
import {customTheme} from "@/utils/theme.utils";
import {Dropdown} from "flowbite-react";
import {ProfileDropdownServer} from "@/app/profile-dropdown/ProfileDropdown.server";

import {getSession} from "@/utils/session.utils";
import {getCurrentPet} from "@/app/profile-dropdown/switch-pet.action";
import {CreatePostForm} from "@/app/(index)/create-post/CreatePostForm";



export default async function () {

    const session = await getSession();
    const currentPet = await getCurrentPet();
    //console.log('Current Pet: ', currentPet);

    return (
        <>
            <div className="bg-themeBackground">


                <div className="mx-auto flex flex-row p-4">



                    <p className="text-center pt-2 px-2">PetName</p>
                </div>
                <div>
                </div>
                <div className="mx-auto flex flex-row pl-4 justify-left bg-themeNavbar mt-2">
                    <ProfileDropdownServer/>
                </div>
            <CreatePostForm profile={session?.profile} currentPetId={currentPet.petId} />

            </div>



        </>
    )
}