import { Box, Typography } from '@mui/material';
import Nav from "@/components/Nav";
import Header from "@/components/Header";
import Calendar from '@/components/Calendar';
import WidgetsPanel from '@/components/WidgetsPanel';
import getAllEvents from "@/lib/getAllEvents";
import { auth } from "@/lib/auth";


export default async function Home() {

    {/*adding the actual events cvreated by createNewEvent.ts 
    and using getAllEvents.ts to display them all is tonitos part, instead of displaying dumby calendar*/}
    
    //this gets the current logged in user from the session
    const session = await auth();
    //and this gets the userEmail from that session after making sure one exists
    if (!session?.user?.email) {
        return { message: "Not authenticated" };
    }
    const userEmail = session.user.email

    //filters events by user and gets them
    const events = await getAllEvents(userEmail);

    //this creates a calendar object that is passed as the component and groups all the the 
    //data the ui needs to make the calendar view 
    const calendar = {
        id: "cal-1",
        name: "My Calendar",
        events,
    };

    return (
        <>
            <Header />
            <Nav />
            <Box
                component="main"
                sx={{
                    width: "100%",
                    height: "100%",
                    background: "#F3E3D0",
                    padding: 5,
                    boxSizing: "border-box",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        justifyContent: "space-between",
                        gap: 5,
                    }}
                >
                    {/* Calendar panel */}
                    <Box sx={{ flex: 1 }}>
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
                                color: "#000",
                            }}
                        >
                            {calendar.name}
                        </Typography>
                        <Box sx={{ height: { xs: "60vh", md: "80vh" } }}>
                            <Calendar calendar={calendar} />
                        </Box>
                    </Box>

                    {/* Widget panel */}
                    <Box sx={{ width: { xs: "100%", md: "280px" }, flexShrink: 0, margin: "auto" }}>
                        <WidgetsPanel />
                    </Box>
                </Box>
            </Box>
        </>
    );
}