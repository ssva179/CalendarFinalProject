//Job - Stephanie: Authentication
//signout component that allows user sign-out using NextAuth.
//Client side tool and it is used directly in our NavMenu file.
"use client"
import { signOut } from "next-auth/react"

export function SignOut() {
    //redirects based on user stage (if were in we just redirect back to log in when signing out)
    //sign in structure from next-auth docs
    //https://next-auth.js.org/getting-started/client
    return <button onClick={() => signOut({ callbackUrl: "/login" })}>SIGN OUT</button>
}