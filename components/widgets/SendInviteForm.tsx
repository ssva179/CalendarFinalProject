"use client";

// Small form to invite another user (by email) to one of your events.
// Pulls your own upcoming events into a dropdown so you don't have to
// know an event's database ID.
// Responsibility: Bidipta.

import { useEffect, useState } from "react";
import { Box, Button, MenuItem, TextField, Stack, Alert } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { EventProps } from "@/types";

export default function SendInviteForm() {
    const [events, setEvents] = useState<EventProps[]>([]);
    const [eventId, setEventId] = useState("");
    const [toEmail, setToEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    // Named type avoids a TSX parser hiccup with inline generic type args on useState.
type Feedback = { kind: "success" | "error"; msg: string };

const [feedback, setFeedback] = useState<Feedback | null>(null);

    // Load the user's events for the dropdown. Reuses /api/events/upcoming
    // with a wide 365-day window so the dropdown is useful year-round.
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/events/upcoming?days=365");
                if (!res.ok) return;
                const data = await res.json();
                const parsed: EventProps[] = data.events.map((e: any) => ({
                    ...e,
                    start: new Date(e.start),
                    end: new Date(e.end),
                }));
                setEvents(parsed);
            } catch {
                // Silent fail — dropdown will just be empty.
            }
        })();
    }, []);

    async function handleSubmit() {
        setFeedback(null);
        if (!eventId || !toEmail) {
            setFeedback({ kind: "error", msg: "Pick an event and enter an email." });
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch("/api/invites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ eventId, toEmail }),
            });
            if (res.ok) {
                setFeedback({ kind: "success", msg: "Invite sent!" });
                setToEmail("");
                setEventId("");
            } else {
                const data = await res.json().catch(() => ({}));
                setFeedback({ kind: "error", msg: data.error || "Could not send invite." });
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Box sx={{ mt: 1 }}>
            <Stack spacing={1}>
                <TextField
                    select
                    label="Event"
                    size="small"
                    value={eventId}
                    onChange={(e) => setEventId(e.target.value)}
                    fullWidth
                >
                    <MenuItem value="">
                        <em>Select one of your events</em>
                    </MenuItem>
                    {events.map((e) => (
                        <MenuItem key={e.id} value={e.id}>
                            {e.name} — {e.start.toLocaleDateString()}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Invitee email"
                    size="small"
                    type="email"
                    value={toEmail}
                    onChange={(e) => setToEmail(e.target.value)}
                    fullWidth
                />
                <Button
                    variant="contained"
                    startIcon={<SendIcon />}
                    disabled={submitting}
                    onClick={handleSubmit}
                >
                    {submitting ? "Sending..." : "Send invite"}
                </Button>
                {feedback && (
                    <Alert severity={feedback.kind} sx={{ py: 0 }}>
                        {feedback.msg}
                    </Alert>
                )}
            </Stack>
        </Box>
    );
}