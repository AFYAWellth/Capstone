'use client'
import {Button, Checkbox, Label, Select, TextInput} from "flowbite-react";
import React, {useState} from "react";
import {Cat} from "@/app/(index)/create-pet-profile/Cat";
import {Dog} from "@/app/(index)/create-pet-profile/Dog";
import {Pet, PetSchema} from "@/utils/models/pet/pet.model";
import {preformCreatePet} from "@/utils/models/pet/pet.action";
import {Status} from "@/utils/interfaces/Status";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {DisplayStatus} from "@/components/navigation/DisplayStatus";
import {ImageUploadDropZone} from "@/components/ImageUploadDropZone";
import {postImage} from "@/utils/models/post/post.action";
import {redirect, useRouter} from "next/navigation";




export default function () {
    const router = useRouter();
    const [selectedValue, setSelectedValue] = useState<string>('Model Type');
    const [status, setStatus] = useState<Status | null>(null);
    const defaultValues: Pet = {
        petId: "",
        petProfileId: "",
        petBreed: "",
        petImageUrl: "",
        petName: "",
        petPersonality: "",
        petSize: "",
        petType: ""
    }

    const PartialPetSchema = PetSchema.omit({petId: true, petProfileId: true}).extend(
        {
            petImageUrl: z.preprocess((val) => (val === "" ? null : val), z.any().optional())

        }
    )

    type PartialPet = z.infer< typeof PartialPetSchema>
    const {register, handleSubmit, control, setError, reset, formState: {errors}} = useForm<PartialPet>({
        resolver: zodResolver(PartialPetSchema),
        defaultValues,
        mode: 'onBlur'
    })


    const [selectedImage, setSelectedImage] = React.useState<string|null>(null)



    const createPets = async (data:PartialPet) => {
        try {
            let petImageUrl = null
            if(data.petImageUrl) {

                const response = await postImage(data.petImageUrl);
                //console.log(response)
                if (response.status === 200) {
                    petImageUrl = response.message
                } else {
                    setStatus({status: 500, message: 'Image failed to upload', data: undefined})
                    return
                }
           }

            // @ts-ignore
            const finalResponse = await preformCreatePet({...data, petImageUrl})
            setStatus(finalResponse)
            if (finalResponse.status === 200) {
                reset()
                router.push('/')

            }

        }catch (error) {
            setStatus({status:500, message: 'Internal Server Error try again later', data: undefined})
        }
    }
    return (
        <>

            <div>
                <img className="rounded-full w-36 h-36 mx-auto my-5" src={"https://placehold.co/400"} alt="placeholder"/>
            </div>
            <div className="flex justify-center">
            <form onSubmit={handleSubmit(createPets)} className="">
                <div className={"max-w-md"}>
                    <h3 className={"text-center"}>Create Pet Profile</h3>

                    <div className= "max-w-md">
                        <div className="mb-2 block">
                            <Label htmlFor="SelectTypeofPet" value="Select Type of Pet"/>
                        </div>

                        <Select {...register('petType')} id="Selected Pet" value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)} required>
                            <option value={""}>Cat or Dog</option>
                            <option value={"Cat"}>Cat</option>
                            <option value={"Dog"}>Dog</option>
                        </Select>
                        {selectedImage && <img src={selectedImage} alt="selected image" width={300}/>}

                        <ImageUploadDropZone control={control} fieldValue={'petImageUrl'} setSelectedImage={setSelectedImage} setError={setError}/>

                        {selectedValue === 'Cat' && (
                            <Cat register={register}/>
                        )}

                        {selectedValue === 'Dog' && (
                            <Dog register={register}/>
                        )}

                        <Button  className=" mx-auto my-4" onClick={()=>{
                            router.push('/choose-pet')
                        }}> Switch pet </Button>
                        <Button type="submit" className=" mx-auto my-4 "> Create Pet </Button>

                    </div>

                </div>
                <DisplayStatus  status={status}/>
            </form>

            </div>



        </>
    )
}