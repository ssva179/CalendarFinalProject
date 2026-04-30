// Sends a new invite. The inviter must own the event they're sharing,
// and we block duplicate pending invites for the same (event, invitee) pair.
// Bidipta.

import { ObjectId } from "mongodb";
import getCollection, { EVENTS_COLLECTION, INVITES_COLLECTION } from "@/db";
import { InviteProps } from "@/types";

export default async function sendInvite(
    eventId: string,
    fromEmail: string,
    toEmail: string,
): Promise<InviteProps | null> {
    // reject when inviting yourself, does nothing
    if (fromEmail === toEmail) 
        return null;

    // Look up the event so we can snapshot it onto the invite.
    const eventsCollection = await getCollection(EVENTS_COLLECTION);
    let event;
    try {
        event = await eventsCollection.findOne({ _id: new ObjectId(eventId) });
    } catch {
        return null; // invalid ObjectId
    }
    if (!event) 
        return null;

    // Only the event owner can invite others to it.
    if (event.userEmail !== fromEmail) 
        return null;

    const invitesCollection = await getCollection(INVITES_COLLECTION);

    // Don't stack duplicate pending invites bc that is pointless
    const existing = await invitesCollection.findOne({
        eventId,
        toEmail,
        status: "pending",
    });
    if (existing) 
        return null;

    //a copy/snapshot of the event
    const doc = {
        eventId,
        fromEmail,
        toEmail,
        status: "pending" as const,
        createdAt: new Date(),
        eventSnapshot: {
            name: event.name,
            start: event.start,
            end: event.end,
            notes: event.notes || [],
        },
    };

    const res = await invitesCollection.insertOne(doc);
    if (!res.acknowledged) return null;
        return { ...doc, id: res.insertedId.toHexString() };
        // Mongo assigned us an _id during the insert. Convert it to a hex string
        // andtack it onto the doc so we can return a complete InviteProps to the caller.
}