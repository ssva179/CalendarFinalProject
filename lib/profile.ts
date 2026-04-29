//Job - Stephanie:  authentication + profile
"use server";

import getCollection, { USERS_COLLECTION } from "@/db";
import { auth } from "@/lib/auth";
import { User } from "@/types";

export default async function updateProfile(data: {name: string; phone: string; bio: string;
}) {
    //ensuring we are signed in using session cookies handled by auth.js framework
    //session cookies handled by Auth.js:
    //https://authjs.dev/getting-started/session-management/get-session
    const session = await auth();
    //ensuring we are still in session
    if (!session?.user?.email) {
        return { message: "Not authenticated" };
    }

    const users = await getCollection(USERS_COLLECTION);

    //adding document of user to database after prompting user to sign in and make profile
    await users.updateOne(
        { email: session.user.email },
        {
            $set: {
                name: data.name,
                phone: data.phone,
                bio: data.bio,
                hasProfile: true,
            },
        }
    );
    return null;
}