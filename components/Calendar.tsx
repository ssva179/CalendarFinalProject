// Edison (UI + Calendar)
"use client"

import { useState, useRef } from "react";
import { EventProps, CalendarProps } from "@/types";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";

import { Drawer, Box } from "@mui/material";
import EventCard from "./EventCard";

// Helpers
// converts an EventProp to a prop usable by FullCalendar
function toFullCalendarEvents(events: EventProps[]) {
    return events.map((e) => ({
        id: e.id,
        title: e.name,
        start: new Date(e.start),
        end: new Date(e.end),
        extendedProps: { original: e },
    }));
}

// Event Detail Drawer
// Displays an overlay on the right about an Event
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
// Inputs a CalendarProp to display its data using FullCalendar
export default function Calendar({ calendar }: { calendar: CalendarProps }) {

    // click to select an event to open and close its EventCard
    const [selectedEvent, setSelectedEvent] = useState<EventProps | null>(null);
    const calendarRef = useRef<FullCalendar>(null);

    const handleEventClick = (arg: EventClickArg) => {
        const original = arg.event.extendedProps.original as EventProps;
        setSelectedEvent(original);
    };

    return (
        // Container
        <Box
            sx={{
                height: "100%",
                backgroundColor: "#D2C4B4",
                display: "flex",
                flexDirection: "column",
                "& .fc": { fontFamily: "inherit", flex: 1, color: "#000" }, // inherit the app's font
                "& .fc-theme-standard td, & .fc-theme-standard th": { borderColor: "#000" }, // black cell borders
                "& .fc-theme-standard .fc-scrollgrid": { borderColor: "#000" }, // black outer border
                "& .fc-col-header-cell": { color: "#000" }, // black text
                "& .fc-daygrid-day-number": { color: "#000" }, // black numbers
                border: "2px solid #000",
                borderRadius: 4,
                padding: 3
            }}
        >

            {/* Calendar with plugins for different views */}
            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, multiMonthPlugin, interactionPlugin]}
                initialView="dayGridMonth" // default
                headerToolbar={{
                    left: "prev,next today", // buttons to switch between next day/week/month/year
                    center: "title",
                    right: "multiMonthYear,dayGridMonth,timeGridWeek", // the different calendar views
                }}
                buttonText={{ today: "Today", month: "Month", week: "Week", year: "Year" }}
                events={toFullCalendarEvents(calendar.events)} // add the events to the FullCalendar
                eventClick={handleEventClick} // opens a detail view for an event when clicked
                height="100%"
                multiMonthMaxColumns={3}
            />

            {/* Event Detail that appears */}
            <EventDetailDrawer
                event={selectedEvent}
                onClose={() => setSelectedEvent(null)}
            />
        </Box>
    );
}