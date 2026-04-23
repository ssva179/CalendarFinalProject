import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import getCollection, {USERS_COLLECTION} from "@/db";

export default async function Home() {
    //session cookies handled by Auth.js:
    //https://authjs.dev/getting-started/session-management/get-session
    const session = await auth()
    //we check if anything is null and restart log in
    if (!session || !session.user || !session.user.email) {
        redirect("/login")
    }
    const users = await getCollection(USERS_COLLECTION)

    const user = await users.findOne({email: session.user.email,})
    //if for some reason user is not in db
    if (!user) {
        redirect("/login")
    }
    if(!user.hasProfile) {
        redirect("/profile") //user has not created profile yet
    }
    redirect("/calendar") //user has profile take to calendar

}