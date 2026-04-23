// Create a new invite. The inviter must own the event they're sharing,
// and we block duplicate pending invites for the same (event, invitee) pair.
// Responsibility: Bidipta.

import { ObjectId } from "mongodb";
import getCollection, { EVENTS_COLLECTION, INVITES_COLLECTION } from "@/db";
import { InviteProps } from "@/types";

export default async function sendInvite(
    eventId: string,
    fromEmail: string,
    toEmail: string,
): Promise<InviteProps | null> {
    // Inviting yourself is pointless — reject early.
    if (fromEmail === toEmail) return null;

    // Look up the event so we can snapshot it onto the invite.
    const eventsCollection = await getCollection(EVENTS_COLLECTION);
    let event;
    try {
        event = await eventsCollection.findOne({ _id: new ObjectId(eventId) });
    } catch {
        return null; // invalid ObjectId
    }
    if (!event) return null;

    // Only the event owner can invite others to it.
    if (event.userEmail !== fromEmail) return null;

    const invitesCollection = await getCollection(INVITES_COLLECTION);

    // Don't stack duplicate pending invites.
    const existing = await invitesCollection.findOne({
        eventId,
        toEmail,
        status: "pending",
    });
    if (existing) return null;

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
}