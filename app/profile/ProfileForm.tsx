"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import updateProfile from "@/lib/profile";

export default function ProfileForm() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    return (
        <form
            className="w-50/100 h-96 rounded-xl p-4 bg-fuchsia-200 shadow-xl border-3 border-double border-red-900"
            onSubmit={(e) => {
                e.preventDefault();

                updateProfile(name)
                    .then((res) => {
                        if (res?.message) {
                            setErrorMessage(res.message);
                            return;
                        }

                        setErrorMessage("");
                        setName("");
                        router.push("/calendar");
                    })
                    .catch(() => {
                        setErrorMessage("Error updating profile");
                    });
            }}
        >
            <h2 className="text-2xl font-serif italic p-4 text-center text-black">
                Create Profile
            </h2>

            <input
                className="w-80/100 bg-white text-black p-2 rounded shadow-xl border-3 border-double border-red-900"
                type="text"
                placeholder="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            {errorMessage && (
                <p className="text-red-600 text-sm">{errorMessage}</p>
            )}

            <div className="w-full flex justify-center m-2">
                <button
                    type="submit"
                    className="bg-indigo-400 w-25/100 text-white px-4 py-2 rounded shadow-xl border-3 border-double border-red-900"
                >
                    Save
                </button>
            </div>
        </form>
    );
}