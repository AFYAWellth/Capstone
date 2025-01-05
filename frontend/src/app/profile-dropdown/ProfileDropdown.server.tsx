'use server'
import {getSession} from "@/utils/session.utils";
import {fetchPetById, fetchPetsByProfileID} from "@/utils/models/pet/pet.action";
import {ProfileDropdown} from "@/app/profile-dropdown/ProfileDropdown";
import {getCurrentPet} from "@/app/profile-dropdown/switch-pet.action";
import {switchPet} from "@/app/profile-dropdown/switch-pet.action";
type Props = {
    redirectHome?: boolean

}
export async function ProfileDropdownServer(props: Props) {
    const {
        redirectHome
    } = props
    const session = await getSession();
    if (!session) {
        return <></>
    }
    const profile = session.profile;
   // console.log(profile);

    const pets = await fetchPetsByProfileID(profile.profileId)
    const currentPet = await getCurrentPet()
    return (
        <ProfileDropdown redirectHome= {redirectHome} profile={profile} pets={pets} switchPet={switchPet} currentPet={currentPet}/>
    )

}