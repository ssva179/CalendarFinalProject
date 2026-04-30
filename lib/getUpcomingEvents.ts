// Return a user's events in the next N days, sorted chronologically.
// Used by the Upcoming Events widget and (with a wide N) by the
// Send Invite form to populate its event dropdown.
// Responsibility: Bidipta.

import getCollection, { EVENTS_COLLECTION } from "@/db";
import { EventProps } from "@/types";

export default async function getUpcomingEvents(
    userEmail: string,
    days: number = 7,
): Promise<EventProps[]> {
    const eventsCollection = await getCollection(EVENTS_COLLECTION);

    const now = new Date();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + days);

    const data = await eventsCollection
        .find({
            userEmail,
            start: { $gte: now, $lte: cutoff },
        })
        .sort({ start: 1 })
        .toArray();

     // Same mongo -> typed object cleanup as getInvites.
    return data.map((e: any) => ({
        id: e._id.toHexString(),
        name: e.name,
        notes: e.notes || [],
        start: new Date(e.start),
        end: new Date(e.end),
        userEmail: e.userEmail,
    }));
}