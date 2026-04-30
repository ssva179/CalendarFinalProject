//Job - Stephanie: Authentication and Sign-in
// Implemented sign-in/authentication page and redirection set up
//Sign-in page doesn't render nav, so I removed header/nav from layout and just added them where
//necessary. This page redirects a user based on wether they are a new or returning user.
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

    //we use the email as the unique identifier so we get it from session
    const user = await users.findOne({email: session.user.email,})
    //extra check to see if for some reason user is not in db
    if (!user) {
        redirect("/login")
    }
    if(!user.hasProfile) {
        redirect("/profile") //user has not created profile yet
    }
    redirect("/calendar") //user has profile take to calendar

}