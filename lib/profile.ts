//Job - Stephanie:  authentication + profile
//Server file that updates a users information in the database. To do this I verify whose
//session we are in and that it is a valid session using a users email.
//Then I use the update mongodb command to update the appropriate fields.
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