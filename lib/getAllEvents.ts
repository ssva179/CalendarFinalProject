import { EventProps } from "@/types";
import getCollection, { EVENTS_COLLECTION } from "@/db";

export default async function getAllEvents(): Promise<EventProps []> {
    const eventsCollection = await getCollection(EVENTS_COLLECTION);
    const data = await eventsCollection.find().toArray();

    return data.map((e: any) => ({
        id: e._id.toHexString(),
        name: e.name,
        notes: e.notes || [],
        start: new Date(e.start),
        end: new Date(e.end),
        userEmail: e.userEmail,
    }));
}