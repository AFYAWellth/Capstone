import {Button, Label, Select, TextInput} from "flowbite-react";

type Props = {
    register:any
}
export function Cat(props:Props) {
const {register} = props
    return (
        <>
                <div className=" items-center max-w-md">
                    <div className="mb-2 block">
                        <Label htmlFor="petname" value="Pet Name"/>
                    </div>
                    <TextInput {...register('petName')} id="petname" type="PetModel Name" placeholder='"Pet Name"' required shadow/>
                </div>
                <div className="max-w-md">
                    <div className="mb-2 block">
                        <Label htmlFor="CatBreed" value="Cat Breed"/>
                    </div>
                    <TextInput {...register('petBreed')} id="CatBreed" type="CatBreed" placeholder='"Cat Breed"' required shadow/>
                </div>

                <div className="max-w-md">
                    <div className="mb-2 block">
                        <Label htmlFor="Personality" value="Personality of your cat"/>
                    </div>
                    <Select {...register('petPersonality')} id="Personality" required>
                        <option value={'Personality'}>Personality</option>
                        <option value={'Fancy'}>Fancy</option>
                        <option value={'Clam'}>Calm</option>
                        <option value={'Playful'}>Playful</option>
                        <option value={'Excite'}>Excited</option>
                        <option value={'Snooty'}>Snooty</option>
                        <option value={'Loner'}>Loner</option>
                    </Select>
                </div>

        </>
    )
}