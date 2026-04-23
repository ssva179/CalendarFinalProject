"use server";

import getCollection, { USERS_COLLECTION } from "@/db";
import { auth } from "@/lib/auth";

export default async function updateProfile(name: string) {
    const session = await auth();

    if (!session?.user?.email) {
        return { message: "Not authenticated" };
    }

    const users = await getCollection(USERS_COLLECTION);

    await users.updateOne(
        { email: session.user.email },
        {
            $set: {
                name,
                hasProfile: true,
            },
        }
    );

    return null;
}