import { CalendarProps } from "./types";

const now = new Date();
const sampleUserEmail = "sample@example.com";

// can be replaced if we had actual EventProps from MongoDb with Dates
function daysFromNow(days: number, hours = 0, minutes = 0): Date {
    // date now
    const d = new Date(now);

    // set from today
    d.setDate(d.getDate() + days);

    // set the specific hours
    d.setHours(hours, minutes, 0, 0);
    return d;
}

export const sampleCalendar: CalendarProps = {
    id: "cal-1",
    name: "My Calendar",
    events: [
        {
            id: "evt-1",
            name: "Team Standup",
            notes: ["Zoom link in Slack", "Bring sprint update"],
            start: daysFromNow(0, 9, 0),
            end: daysFromNow(0, 9, 30),
            userEmail: sampleUserEmail,
        },
        {
            id: "evt-2",
            name: "Lunch with Sarah",
            notes: ["Cafe Nero on Main St", "She's paying 🎉"],
            start: daysFromNow(1, 12, 30),
            end: daysFromNow(1, 13, 30),
            userEmail: sampleUserEmail,
        },
        {
            id: "evt-3",
            name: "Dentist Appointment",
            notes: ["Bring insurance card", "Arrive 10 min early"],
            start: daysFromNow(2, 10, 0),
            end: daysFromNow(2, 11, 0),
            userEmail: sampleUserEmail,
        },
        {
            id: "evt-4",
            name: "Product Review",
            notes: ["Prepare slides", "Invite design team", "Book conf room B"],
            start: daysFromNow(3, 14, 0),
            end: daysFromNow(3, 15, 30),
            userEmail: sampleUserEmail,
        },
        {
            id: "evt-5",
            name: "Weekend Hike",
            notes: ["Trail: Blue Hills", "Pack snacks", "Check weather beforehand"],
            start: daysFromNow(5, 8, 0),
            end: daysFromNow(5, 12, 0),
            userEmail: sampleUserEmail,
        },
        {
            id: "evt-6",
            name: "Flight to NYC",
            notes: ["Terminal B", "Check in online 24hr before"],
            start: daysFromNow(7, 6, 45),
            end: daysFromNow(7, 8, 30),
            userEmail: sampleUserEmail,
        },
        {
            id: "evt-7",
            name: "NYC Conference",
            notes: ["Badge pickup at registration", "Session: AI in Product Design @ 2pm"],
            start: daysFromNow(7, 9, 0),
            end: daysFromNow(9, 18, 0),
            userEmail: sampleUserEmail,
        },
        {
            id: "evt-8",
            name: "1:1 with Manager",
            notes: ["Discuss Q3 goals", "Ask about promotion timeline"],
            start: daysFromNow(-3, 11, 0),
            end: daysFromNow(-3, 11, 30),
            userEmail: sampleUserEmail,
        },
        {
            id: "evt-9",
            name: "Gym — Leg Day",
            notes: ["Don't skip"],
            start: daysFromNow(-1, 7, 0),
            end: daysFromNow(-1, 8, 0),
            userEmail: sampleUserEmail,
        },
        {
            id: "evt-10",
            name: "Birthday Dinner — Mom",
            notes: ["Reservation at Osteria 7pm", "Pick up cake beforehand", "Card in desk drawer"],
            start: daysFromNow(12, 19, 0),
            end: daysFromNow(12, 21, 0),
            userEmail: sampleUserEmail,
        },
    ],
};
