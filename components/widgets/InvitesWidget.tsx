"use client";

// Lists the user's pending invites with Accept / Decline buttons.
// Responsibility: Bidipta.

import { useEffect, useState } from "react";
import { Box, Typography, Button, Stack, CircularProgress } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { InviteProps } from "@/types";

export default function InvitesWidget() {
    const [invites, setInvites] = useState<InviteProps[]>([]);
    const [loading, setLoading] = useState(true);
    // Tracks which row has a request in flight so we can disable its buttons.
    const [respondingId, setRespondingId] = useState<string | null>(null);

    async function loadInvites() {
        setLoading(true);
        try {
            const res = await fetch("/api/invites?status=pending");
            if (!res.ok) {
                setInvites([]);
                return;
            }
            const data = await res.json();
            // Dates arrive as ISO strings over HTTP — revive them.
            const parsed: InviteProps[] = data.invites.map((i: any) => ({
                ...i,
                createdAt: new Date(i.createdAt),
                eventSnapshot: {
                    ...i.eventSnapshot,
                    start: new Date(i.eventSnapshot.start),
                    end: new Date(i.eventSnapshot.end),
                },
            }));
            setInvites(parsed);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadInvites();
    }, []);

    async function respond(id: string, response: "accepted" | "declined") {
        setRespondingId(id);
        try {
            const res = await fetch(`/api/invites/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ response }),
            });
            if (res.ok) {
                // Remove from pending list immediately — no need to refetch.
                setInvites((prev) => prev.filter((i) => i.id !== id));
            }
        } finally {
            setRespondingId(null);
        }
    }

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
                <CircularProgress size={20} />
            </Box>
        );
    }

    if (invites.length === 0) {
        return (
            <Typography variant="body2" sx={{ color: "text.secondary", fontStyle: "italic" }}>
                No pending invites.
            </Typography>
        );
    }

    return (
        <Stack spacing={1.5}>
            {invites.map((invite) => (
                <Box
                    key={invite.id}
                    sx={{ color: "#fff", borderRadius: 2, p: 1.5, border: "1px solid #ccc" }}
                >
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {invite.eventSnapshot.name}
                    </Typography>
                    <Typography variant="caption" sx={{ display: "block", color: "text.secondary" }}>
                        from {invite.fromEmail}
                    </Typography>
                    <Typography variant="caption" sx={{ display: "block", color: "text.secondary" }}>
                        {invite.eventSnapshot.start.toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                        })}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        <Button
                            size="small"
                            variant="contained"
                            color="success"
                            startIcon={<CheckIcon />}
                            disabled={respondingId === invite.id}
                            onClick={() => respond(invite.id, "accepted")}
                        >
                            Accept
                        </Button>
                        <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<CloseIcon />}
                            disabled={respondingId === invite.id}
                            onClick={() => respond(invite.id, "declined")}
                        >
                            Decline
                        </Button>
                    </Stack>
                </Box>
            ))}
        </Stack>
    );
}