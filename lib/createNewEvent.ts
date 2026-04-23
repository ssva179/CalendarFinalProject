"use server";

import { EventProps } from "@/types";
import getCollection from "@/db";

export default async function createNewEvent(
    name: string,
    start: Date,
    end: Date, 
    notes: string[],
    userEmail: string
): Promise<EventProps | null> {
    const e = {
        name,
        start,
        end, 
        notes,
        userEmail,
        eventSource: "manual",
    };

    const eventsCollection = await getCollection("events-collection");
    const res = await eventsCollection.insertOne(e);

    if (!res.acknowledged) {
        return null;
    }

    return {...e, id:res.insertedId.toHexString(),};
}
