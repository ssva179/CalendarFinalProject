"use client"

import { useState, useRef } from "react";
import { EventProps, CalendarProps } from "@/types";

// FullCalendar imports
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";

// MUI imports
import { Drawer, Box } from "@mui/material";

// Components
import EventCard from "./EventCard";

// Helpers
function toFCEvents(events: EventProps[]) {
    return events.map((e) => ({
        id: e.id,
        title: e.name,
        start: new Date(e.start),
        end: new Date(e.end),
        extendedProps: { original: e },
    }));
}

// Event Detail Drawer
function EventDetailDrawer({ event, onClose }: { event: EventProps | null; onClose: () => void }) {
    return (
        <Drawer
            anchor="right"
            open={!!event}
            onClose={onClose}
            slotProps={{
                paper: {
                    sx: {
                        width: { xs: "100vw", sm: 400 },
                        p: 0,
                        display: "flex",
                        flexDirection: "column",
                    },
                },
            }}
        >
            {event && <EventCard event={event} onClose={onClose} />}
        </Drawer>
    );
}

// Calendar
export function Calendar({ calendar }: { calendar: CalendarProps }) {
    const [selectedEvent, setSelectedEvent] = useState<EventProps | null>(null);
    const calendarRef = useRef<FullCalendar>(null);

    const handleEventClick = (arg: EventClickArg) => {
        const original = arg.event.extendedProps.original as EventProps;
        setSelectedEvent(original);
    };

    return (

        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                "& .fc": { fontFamily: "inherit", flex: 1, color: "#000" },
                "& .fc-theme-standard td, & .fc-theme-standard th": { borderColor: "#000" },
                "& .fc-theme-standard .fc-scrollgrid": { borderColor: "#000" },
                "& .fc-col-header-cell": { color: "#000" },
                "& .fc-daygrid-day-number": { color: "#000" },
                border: "1px solid #000",
                borderRadius: 4,
            }}
        >
            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, multiMonthPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "multiMonthYear,dayGridMonth,timeGridWeek",
                }}
                buttonText={{ today: "Today", month: "Month", week: "Week", year: "Year" }}
                events={toFCEvents(calendar.events)}
                eventClick={handleEventClick}
                height="100%"
                multiMonthMaxColumns={3}
            />

            <EventDetailDrawer
                event={selectedEvent}
                onClose={() => setSelectedEvent(null)}
            />
        </Box>
    );
}

export default Calendar;
