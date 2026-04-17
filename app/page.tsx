import Header from '@/components/Header';
import styled from 'styled-components';
import { Box, Button, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const StyledMain = styled.main`
    width: 100%;
    height: 90vh;
    background: #5cc5be;
    padding: 24px;
    box-sizing: border-box;
`;

export default function Home() {

    // react hooks here

    return (
        <>
            <Header />
            <StyledMain>

                {/* Nav row: arrows + month + view toggle */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>

                    {/* select day/month/year */}
                    <Button variant="text" sx={{ minWidth: 0 }}><ArrowBackIcon /></Button>
                        <Typography variant="h6">Month</Typography>
                    <Button variant="text" sx={{ minWidth: 0 }}><ArrowForwardIcon /></Button>

                    {/* switches view (weekly/monthly) */}
                    <Button variant="outlined" sx={{ ml: 2, borderRadius: 2 }}>Weekly ^</Button>
                </Box>

                {/* Main content row: calendar + widget */}
                <Box sx={{ display: 'flex', gap: 2, height: 'calc(100% - 60px)' }}>

                    {/* Calendar view panel */}
                    <Box sx={{
                        flex: 2,
                        bgcolor: '#348a85',
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'flex-end',
                        p: 3,
                    }}>
                        <Typography variant="h6" color="text.secondary">
                            (monthly view calendar)
                        </Typography>
                    </Box>

                    {/* Widget panel */}
                    <Box sx={{ flex: 1, bgcolor: '#e0e0e0', borderRadius: 4, p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
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
                </Box>
            </StyledMain>
        </>
    );
}