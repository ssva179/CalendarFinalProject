"use server";
import { ObjectId } from "mongodb";
import getCollection, { EVENTS_COLLECTION } from "@/db";

export default async function deleteEvent(id: string): Promise<boolean> {
    const eventsCollection = await getCollection(EVENTS_COLLECTION);

    const res = await eventsCollection.deleteOne({
        _id: new ObjectId(id),
    });

    return res.deletedCount === 1;
}