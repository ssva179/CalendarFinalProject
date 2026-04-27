// Sidebar panel composing all three widgets.
// Styled with MUI's sx prop 
// Responsibility: Bidipta.
"use client";
import { Box, Typography, Divider } from "@mui/material";
import InvitesWidget from "@/components/widgets/InvitesWidget";
import SendInviteForm from "@/components/widgets/SendInviteForm";
import UpcomingEventsWidget from "@/components/widgets/UpcomingEventsWidget";


export default function WidgetsPanel() {
    return (
        <Box
            sx={{
                width: { xs: "100%", md: 300 }, // width: 300,
                bgcolor: "#e0e0e0", // background: "#F3E3D0",
                borderRadius: 4,
                p: 3,
                display: "flex",
                flexDirection: "column",
                gap: 2.5,
                border: "1px solid #000",
            }}
        >
            <Typography variant="h6" sx={{ textAlign: "center", color: "#000" }}>
                Widgets
            </Typography>

            {/* --- Pending invites (received) --- */}
            <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1, color: "#000"  }}>
                    Invites
                </Typography>
                <InvitesWidget />
            </Box>

            {/* --- Send a new invite --- */}
            <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 0.5, color: "#000"  }}>
                    Share an event
                </Typography>
                <SendInviteForm />
            </Box>

            <Divider />

            {/* --- Upcoming events --- */}
            <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1, color: "#000"  }}>
                    Upcoming events
                </Typography>
                <UpcomingEventsWidget />
            </Box>
        </Box>
    );
}