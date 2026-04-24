"use server";

import getCollection, { USERS_COLLECTION } from "@/db";
import { auth } from "@/lib/auth";
import { User } from "@/types";

export default async function updateProfile(data: {name: string; phone: string; bio: string;
}) {
    const session = await auth();

    if (!session?.user?.email) {
        return { message: "Not authenticated" };
    }

    const users = await getCollection(USERS_COLLECTION);

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