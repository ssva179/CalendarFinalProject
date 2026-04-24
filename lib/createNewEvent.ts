//Tonito's part, this is the logic of creating any event, very similar to lab 9 "create post" 
//uses getColleciton to conect to mongodb collection and insters a new document using insertone 
//and returns the created event with its id

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

    //creates event object and becomes mongodb document
    const e = {
        name,
        start,
        end,
        notes,
        userEmail,
    };

    //connects to collection and then inserts event into mongo db
    const eventsCollection = await getCollection("events-collection");
    const res = await eventsCollection.insertOne(e);

    //if failed return null
    if (!res.acknowledged) {
        return null;
    }

    //return event frommated fro frontend use
    return {
        name,
        start: start.toISOString(),
        end: end.toISOString(),
        notes,
        userEmail,
        id: res.insertedId.toHexString(),
    };
}
