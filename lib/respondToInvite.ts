// Accept or decline an invite. On accept, copy the event onto the
// invitee's calendar so it shows up in their Monthly/Weekly views.
// Responsibility: Bidipta.

import { ObjectId } from "mongodb";
import getCollection, { EVENTS_COLLECTION, INVITES_COLLECTION } from "@/db";

export default async function respondToInvite(
    inviteId: string,
    userEmail: string,
    response: "accepted" | "declined",
): Promise<boolean> {
    const invitesCollection = await getCollection(INVITES_COLLECTION);

    let inviteObjectId: ObjectId;
    try {
        inviteObjectId = new ObjectId(inviteId);
    } catch {
        return false;
    }

    const invite = await invitesCollection.findOne({ _id: inviteObjectId });
    if (!invite) 
        return false;

    // Authorization: only the invitee can respond to their own invite.
    if (invite.toEmail !== userEmail) 
        return false;

    // Can't respond twice cus it would double insert the event.
    if (invite.status !== "pending") 
        return false;

    const updateRes = await invitesCollection.updateOne(
        { _id: inviteObjectId },
        { $set: { status: response, respondedAt: new Date() } },
    );
    if (!updateRes.acknowledged) 
        return false;

    // On accept: drop a copy of the event onto the invitee's calendar.
    // We keep a small audit trail so the calendar can later show "shared by X" if the team wants that.
    if (response === "accepted") {
        const eventsCollection = await getCollection(EVENTS_COLLECTION);
        await eventsCollection.insertOne({
            name: invite.eventSnapshot.name,
            start: invite.eventSnapshot.start,
            end: invite.eventSnapshot.end,
            notes: invite.eventSnapshot.notes || [],
            userEmail: userEmail,
            sourceInviteId: inviteId,
            sourceFromEmail: invite.fromEmail,
        });
    }

        return true;
}