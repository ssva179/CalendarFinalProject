//Job - Stephanie: Authentication
"use client"
import { signIn } from "next-auth/react"

export default function LoginPage() {
    //{/* getting all styling tools from official tailwindcss.com */}
    return (
        <>
            {/* getting all styling tools from official tailwindcss.com */}
            <div className="flex flex-col items-center justify-center bg-radial-[at_bottom] from-purple-500 to-indigo-950 p-4 min-h-screen">
                <div className="border-solid border-indigo-950 shadow-xl shadow-indigo-950 bg-purple-300 rounded-lg w-1/3 min-h-100">
                    <h2 className="flex flex-col items-center  p-6 font-mono font-semibold text-black text-2xl text-center"> WELCOME TO OUR CALENDAR!</h2>
                    <div className="flex flex-col gap-4 items-center p-10 m-2">
                        <img src="/github-logo.png" className="w-20 h-20"/>
                        <button
                            className="bg-indigo-950 text-white p-2 m-2 rounded-lg shadow-lg border border-indigo-800 hover:bg-indigo-600 transition"
                            //redirects based on user stage (profile or no profile)
                            //sign in structure from next-auth docs
                            //https://next-auth.js.org/getting-started/client
                            onClick={() => signIn("github", {callbackUrl:"/" })}>
                            Sign in with GitHub
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}