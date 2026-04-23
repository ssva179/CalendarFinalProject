// GET /api/events/upcoming?days=7   -> signed-in user's next N days of events
// Responsibility: Bidipta.

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import getUpcomingEvents from "@/lib/getUpcomingEvents";

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const daysParam = req.nextUrl.searchParams.get("days");
    const days = daysParam
        ? Math.max(1, Math.min(365, parseInt(daysParam, 10) || 7))
        : 7;

    const events = await getUpcomingEvents(session.user.email, days);
    return NextResponse.json({ events });
}