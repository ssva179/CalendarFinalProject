//tonitos part, this is displaying all the events on the calendar and calling them all from mongodb, very similar to get all posts from lab 9
//connects to events-collection in the database andfilters using userEmail variable created in the calendare page.tsx to get all the events 
//that match that users email so user only sees their own events(or ones they have been invited too)
import { EventProps } from "@/types";
import getCollection from "@/db";

export default async function getAllEvents(userEmail: string): Promise<EventProps []> {
    const eventsCollection = await getCollection("events-collection");//get reference to mongodb collection
    const data = await eventsCollection.find({ userEmail }).toArray();//get events form mongodb that match loggged in user

    //convert mongodb documents for frontend
    return data.map((e) => ({
        id: e._id.toHexString(),
        name: e.name,
        notes: e.notes || [],
        start: new Date(e.start),
        end: new Date(e.end),
        userEmail: e.userEmail,
    }));
}