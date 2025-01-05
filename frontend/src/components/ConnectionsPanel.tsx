'use server'

import Searchbar from "@/components/Searchbar";
import ProfileTab from "@/components/ProfileTab";
import {getCurrentPet} from "@/app/profile-dropdown/switch-pet.action";
import {
    fetchPetsByFolloweeController,
    fetchPetsByFollowersController,
    fetchPetsByProfileID
} from "@/utils/models/pet/pet.action";
import React from "react";
import PetTab from "@/components/PetTab";

export async function ConnectionsPanel() {
    const currentPet = await getCurrentPet();
    const connections = await fetchPetsByFolloweeController(currentPet.petId)
    //console.log(connections)
    return(
        <>
            <div
                className="right-side hidden md:flex md:w-1/3 md:h-svh md:bg-themeBackground md:flex-col md:items-center md:fixed md:top-0 md:right-0">
                <div
                    className="w-full bg-themeBackround pr-8 flex flex-col gap-6 items-center justify-center flex-1">


                    <p className={"text-2xl"}>Connections</p>

                    {
                        connections.slice(0,2).map(connection => <PetTab pet={connection} key = {connection.petId} />)
                    }
                </div>


            </div>

        </>
    )
}
