// REST endpoints for invites.
//   GET  /api/invites?status=pending   -> list invites for the signed-in user
//   POST /api/invites                  -> send a new invite
// Responsibility: Bidipta.

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import getInvites from "@/lib/getInvites";
import sendInvite from "@/lib/sendInvite";
import { InviteStatus } from "@/types";

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const statusParam = req.nextUrl.searchParams.get("status");
    const allowed: InviteStatus[] = ["pending", "accepted", "declined"];
    const status = allowed.includes(statusParam as InviteStatus)
        ? (statusParam as InviteStatus)
        : undefined;

    const invites = await getInvites(session.user.email, status);
    return NextResponse.json({ invites });
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    let body: { eventId?: string; toEmail?: string };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
    }

    const { eventId, toEmail } = body;
    if (!eventId || !toEmail) {
        return NextResponse.json(
            { error: "eventId and toEmail are required" },
            { status: 400 },
        );
    }

    const invite = await sendInvite(eventId, session.user.email, toEmail);
    if (!invite) {
        return NextResponse.json(
            { error: "Could not send invite (event not found, not yours, or duplicate)" },
            { status: 400 },
        );
    }

    return NextResponse.json({ invite }, { status: 201 });
}