// PATCH /api/invites/:inviteId   { response: "accepted" | "declined" }
// Responsibility: Bidipta.

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import respondToInvite from "@/lib/respondToInvite";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ inviteId: string }> },
) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const { inviteId } = await params;

    let body: { response?: string };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
    }

    if (body.response !== "accepted" && body.response !== "declined") {
        return NextResponse.json(
            { error: "response must be 'accepted' or 'declined'" },
            { status: 400 },
        );
    }

    const ok = await respondToInvite(inviteId, session.user.email, body.response);
    if (!ok) {
        return NextResponse.json(
            { error: "Could not update invite (already responded, not yours, or not found)" },
            { status: 400 },
        );
    }

    return NextResponse.json({ ok: true });
}