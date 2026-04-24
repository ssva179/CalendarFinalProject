"use client";

import Link from "next/link";
import { EventProps } from "@/types";
import deleteEvent from "@/lib/deleteEvent";
import { useRouter } from "next/navigation";

// MUI imports
import { Box, Typography, IconButton, Chip, Divider, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import NotesIcon from "@mui/icons-material/Notes";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

// Helpers
function formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function formatTime(date: Date): string {
    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    });
}

export type EventCardProps = {
    event: EventProps;
    onClose: () => void;
};

export default function EventCard({ event, onClose }: EventCardProps) {
    const router = useRouter();

    return (
        <>
            {/* Header */}
            <Box
                sx={{
                    px: 3,
                    py: 2.5,
                    color: "primary.main",
                    color: "primary.contrastText",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 2,
                }}
            >
                <Typography variant="h6" sx={{ lineHeight: 1.3, fontWeight: 600 }}>
                    {event.name}
                </Typography>
                <IconButton
                    onClick={onClose}
                    size="small"
                    sx={{ color: "primary.contrastText", mt: -0.5, mr: -1 }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* Body */}
            <Box sx={{ px: 3, py: 3, flex: 1, overflowY: "auto" }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

                    {/* Date */}
                    <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                        <CalendarTodayIcon fontSize="small" sx={{ mt: 0.25, color: "text.secondary" }} />
                        <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                Date
                            </Typography>
                            <Typography variant="body1">{formatDate(event.start)}</Typography>
                            {event.start.toDateString() !== event.end.toDateString() && (
                                <Typography variant="body2" color="text.secondary">
                                    → {formatDate(event.end)}
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    {/* Time */}
                    <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                        <AccessTimeIcon fontSize="small" sx={{ mt: 0.25, color: "text.secondary" }} />
                        <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                Time
                            </Typography>
                            <Typography variant="body1">
                                {formatTime(event.start)} – {formatTime(event.end)}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Notes */}
                    {event.notes.length > 0 && (
                        <>
                            <Divider sx={{ borderColor: "#c9b8a3" }}/>
                            <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                                <NotesIcon fontSize="small" sx={{ mt: 0.25, color: "text.secondary" }} />
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                        Notes
                                    </Typography>
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                        {event.notes.map((note, i) => (
                                            <Chip
                                                key={i}
                                                label={note}
                                                size="small"
                                                variant="outlined"
                                                sx={{ alignSelf: "flex-start", height: "auto", py: 0.5 }}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            </Box>
                        </>
                    )}
                </Box>
            </Box>

            {/* Footer */}
            <Box sx={{ px: 3, py: 2, borderTop: "1px solid #b8a48f", borderColor: "#b8a48f " }}>
                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteOutlinedIcon />}
                    onClick={async () => {
                        await deleteEvent(event.id);
                        router.refresh(); 
                        onClose();
                    }}
                >
                Delete Event
                </Button>
            </Box>
        </>
    );
}
