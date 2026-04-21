"use client";
import Calendar from '@/components/Calendar';
import WidgetsPanel from '@/components/WidgetsPanel';
import { sampleCalendar } from "@/samplecalendar"; // NEED TO ACTUALLY FETCH CALENDAR DATA FROM MONGODB

import styled from 'styled-components';
import { Box } from '@mui/material';

const StyledMain = styled.main`
    width: 100%;
    height: 90vh;
    background: #F3E3D0;
    padding: 24px;
    box-sizing: border-box;
`;

export default function Home() {
    return (
        <>
            <Box
                component="main"
                sx={{
                    width: "100%",
                    height: "90vh",
                    background: "#F3E3D0",
                    padding: "24px",
                    boxSizing: "border-box",
                }}
            >
                {/* Calendar and Widgets */}
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: 'calc(100% - 60px)' }}>
                    {/* Calendar view and arrows */}
                    <Box sx={{ height: "80vh", bgcolor: "#D2C4B4" }}>
                        <Calendar calendar={sampleCalendar} />
                    </Box>
                    {/* Widget panel */}
                    <WidgetsPanel />
                </Box>
            </Box>
        </>
    );
}