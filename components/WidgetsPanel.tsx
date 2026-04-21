import {Box, Typography} from "@mui/material";

export default function WidgetsPanel() {
    return (
        <>
            <Box sx={{
                width: 280,  // or maxWidth: 280 if you want it to shrink on small screens
                bgcolor: '#e0e0e0',
                borderRadius: 4,
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                border: '1px solid #000'
            }}>
                <Typography variant="h6" sx={{ textAlign: 'center' }}>Widget</Typography>

                {/* Invites section */}
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Invites:</Typography>
                    {/*  FETCH INVITES HERE  */}
                </Box>

                {/* Divider */}
                <Box sx={{ borderTop: '1px solid #bbb' }} />

                {/* Notifications section */}
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Upcoming Events:</Typography>
                    {/* FETCH NOTIFICATIONS HERE */}
                </Box>
            </Box>
        </>
    );
}