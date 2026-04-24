import {Box, Typography} from '@mui/material';
import Nav from "@/components/Nav";
import Header from "@/components/Header";
import Calendar from '@/components/Calendar';
import WidgetsPanel from '@/components/WidgetsPanel';
import getAllEvents from "@/lib/getAllEvents";

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
                    width: "100vw",
                    height: "100vh",
                    background: "#F3E3D0",
                    padding: "24px",
                    boxSizing: "border-box",
                }}
            >
                {/* Calendar and Widgets */}
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: '85vh' }}>

                    {/* Calendar panel */}
                    <Box sx={{ height: "80vh", width: "75vw"}}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                letterSpacing: "0.05em",
                                textTransform: "uppercase",
                                borderLeft: "4px solid",
                                borderColor: "primary.main",
                                pl: 1.5,
                                mb: 2,
                                color: "#000"
                            }}
                        >
                            {calendar.name}
                        </Typography>

                        <Calendar calendar={calendar} />
                    </Box>

                    {/* Widget panel */}
                    <Box>
                        <WidgetsPanel />
                    </Box>
                </Box>
            </Box>
        </>
    );
}