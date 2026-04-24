"use client";

// Compact list of the user's next events (next 7 days, max 5 shown).
// Responsibility: Bidipta.

import { useEffect, useState } from "react";
import { Box, Typography, Stack, CircularProgress } from "@mui/material";
import { EventProps } from "@/types";

export default function UpcomingEventsWidget() {
    const [events, setEvents] = useState<EventProps[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/events/upcoming?days=7");
                if (!res.ok) {
                    setEvents([]);
                    return;
                }
                const data = await res.json();
                const parsed: EventProps[] = data.events.map((e: any) => ({
                    ...e,
                    start: new Date(e.start),
                    end: new Date(e.end),
                }));
                // Cap at 5 so the sidebar doesn't get overwhelmed.
                setEvents(parsed.slice(0, 5));
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
                <CircularProgress size={20} />
            </Box>
        );
    }

    if (events.length === 0) {
        return (
            <Typography variant="body2" sx={{ color: "text.secondary", fontStyle: "italic" }}>
                No events in the next 7 days.
            </Typography>
        );
    }

    return (
        <Stack spacing={1}>
            {events.map((e) => (
                <Box
                    key={e.id}
                    sx={{ color: "#000000", borderRadius: 1.5, p: 1, border: "1px solid #ddd" }}
                >
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {e.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        {e.start.toLocaleString(undefined, {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                        })}
                    </Typography>
                </Box>
            ))}
        </Stack>
    );
}