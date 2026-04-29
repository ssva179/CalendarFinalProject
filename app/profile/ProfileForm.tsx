//Job - Stephanie: Profile creationg and updating to DB
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import updateProfile from "@/lib/profile";

export default function ProfileForm() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [bio, setBio] = useState("");
    const [errorMessage, setErrorMessage] = useState("");


    return (
        <form
            className="flex flex-col gap-4 w-130 h-150 rounded-xl p-5 m-20 items-center bg-white shadow-xl"
            onSubmit={(e) => {
                e.preventDefault();
                //Using server side in lib to update the profile in DB
                updateProfile({name, phone, bio})
                    .then((res) => {
                        if (res?.message) {
                            setErrorMessage(res.message);
                            return;
                        }
                        setErrorMessage("");
                        setName("");
                        //After profile completion take user to calendar
                        router.push("/calendar");
                    })
                    .catch(() => {
                        setErrorMessage("Error updating profile");
                    });
            }}
            //{/* getting all styling tools from official tailwindcss.com */}
        >
            <h2 className="flex flex-col items-center  p-6 font-semibold text-[#81a6c6] text-2xl text-center">
                Create Profile
            </h2>

            <input
                className="w-80/100  h-10/100 bg-white text-black p-2 rounded-lg shadow-sm border border-gray-300"
                type="text"
                placeholder="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                className="w-80/100  h-10/100 bg-white text-black p-2 rounded-lg shadow-sm border border-gray-300"
                type="text"
                placeholder="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <input
                className="w-80/100  h-20/100 bg-white text-black p-2 rounded-lg shadow-sm border border-gray-300"
                type="text"
                placeholder="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
            />

            {errorMessage && (
                <p className="text-red-600 text-sm">{errorMessage}</p>
            )}

            <div className="w-full flex justify-center m-2">
                <button
                    type="submit"
                    className="bg-[#81a6c6] w-80/100 text-white font-bold p-3 rounded shadow-xl hover:bg-blue-900 transition-discrete"
                >
                    SAVE
                </button>
            </div>
        </form>
    );
}