import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import getCollection, {USERS_COLLECTION} from "@/db";
import ProfileForm from "@/app/profile/ProfileForm";
import Header from "@/components/Header";
import Nav from "@/components/Nav";

export default async function ProfilePage() {
    //session cookies handled by Auth.js:
    //https://authjs.dev/getting-started/session-management/get-session
    const session = await auth()
    //we check if anything is null and restart log in
    if (!session || !session.user || !session.user.email) {
        redirect("/login")
    }
    const users = await getCollection(USERS_COLLECTION)

    const user = await users.findOne({email: session.user.email,})
    if (!user) {
        redirect("/login")
    }
    //we get email of the session to look for the corresponding DB item
    if(!user.hasProfile) {
        return (
            <div className="flex flex-col items-center justify-center bg-orange-100 p-4 min-h-screen">
                <ProfileForm />
            </div>
        );
    }
    return (
        <>
            <Header />
            <Nav/>
            <div className="flex flex-col items-center justify-center bg-orange-100 p-4 min-h-screen">
                <div className="flex flex-col gap-4 w-130 h-150 rounded-xl p-5 m-20 items-center bg-white shadow-xl">
                    <h1 className="text-2xl font-bold m-4 text-[#81a6c6]">Your Profile</h1>
                    <img src="/profile.svg" className="w-25 h-25 "/>
                    <p className="text-xl font-bold m-4 text-[#81a6c6]">Name: {user.name}</p>
                    <p className="text-xl font-bold m-4 text-[#81a6c6]">Bio: {user.bio}</p>
                    <p className="text-xl font-bold m-4 text-[#81a6c6]">Email: {user.email}</p>
                    <p className="text-xl font-bold m-4 text-[#81a6c6]">Phone: {user.phone}</p>
                </div>
            </div>
        </>

    );
}
