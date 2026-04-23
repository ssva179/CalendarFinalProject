"use server";
import { ObjectId } from "mongodb";
import getCollection from "@/db";

export default async function deleteEvent(id: string): Promise<boolean> {
    const eventsCollection = await getCollection("events-collection");

    const res = await eventsCollection.deleteOne({
        _id: new ObjectId(id),
    });

    return res.deletedCount === 1;
}