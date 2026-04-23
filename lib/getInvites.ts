// Fetch invites addressed to a specific user, optionally filtered by status.
// Responsibility: Bidipta (widgets + invites).

import getCollection, { INVITES_COLLECTION } from "@/db";
import { InviteProps, InviteStatus } from "@/types";

export default async function getInvites(
    userEmail: string,
    status?: InviteStatus,
): Promise<InviteProps[]> {
    const invitesCollection = await getCollection(INVITES_COLLECTION);

    // Always filter by recipient; optionally also by status.
    const query: Record<string, unknown> = { toEmail: userEmail };
    if (status) query.status = status;

    const data = await invitesCollection
        .find(query)
        .sort({ createdAt: -1 })  // newest first
        .toArray();

    return data.map((i: any) => ({
        id: i._id.toHexString(),
        eventId: i.eventId,
        fromEmail: i.fromEmail,
        toEmail: i.toEmail,
        status: i.status,
        createdAt: new Date(i.createdAt),
        eventSnapshot: {
            name: i.eventSnapshot.name,
            start: new Date(i.eventSnapshot.start),
            end: new Date(i.eventSnapshot.end),
            notes: i.eventSnapshot.notes || [],
        },
    }));
}