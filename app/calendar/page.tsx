import Calendar from '@/components/Calendar';
import WidgetsPanel from '@/components/WidgetsPanel';
import getAllEvents from "@/lib/getAllEvents";

import styled from 'styled-components';
import { Box } from '@mui/material';
import Nav from "@/components/Nav";
import Header from "@/components/Header";

const StyledMain = styled.main`
    width: 100%;
    height: 90vh;
    background: #F3E3D0;
    padding: 24px;
    box-sizing: border-box;
`;

export default async function Home() {
    const events = await getAllEvents();

    const calendar = {id: "cal-1",
        name: "My Calendar",
        events,
    };

    return (
        <>
            <Header />
            <Nav/>
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
                        <Calendar calendar={calendar} />
                    </Box>
                    {/* Widget panel */}
                    <WidgetsPanel />
                </Box>
            </Box>
        </>
    );
}