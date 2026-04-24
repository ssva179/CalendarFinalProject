"use server";

import { stringEvent } from "@/types";
import getCollection from "@/db";

export default async function createNewEvent(
    name: string,
    start: Date,
    end: Date,
    notes: string[],
    userEmail: string
): Promise<stringEvent | null> {

    const e = {
        name,
        start,
        end,
        notes,
        userEmail,
    };

    const eventsCollection = await getCollection("events-collection");
    const res = await eventsCollection.insertOne(e);

    if (!res.acknowledged) {
        return null;
    }

    return {
        name,
        start: start.toISOString(),
        end: end.toISOString(),
        notes,
        userEmail,
        id: res.insertedId.toHexString(),
    };
}
