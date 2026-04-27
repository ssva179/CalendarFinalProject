//tonito's part, this is the logic to delete any events 
//cpnverts the string id into mongodb object id and uses delteone to remove the matchingg document form the collection

"use server";
import { ObjectId } from "mongodb";
import getCollection from "@/db";

export default async function deleteEvent(id: string): Promise<boolean> {
    const eventsCollection = await getCollection("events-collection");

    const res = await eventsCollection.deleteOne({ //deletes the object with matching id
        _id: new ObjectId(id),
    });

    return res.deletedCount === 1;//returns true if exaclty one document was deleted
}