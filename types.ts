// FEEL FREE TO EDIT OR CHANGE

// An invite to a collaborational calendar from a user to another user
export type InviteProps = {
    from: string;
    to: string;
    accepted: boolean;
}

// An event in a calendar
export type EventProps = {
    id: string;
    name: string;
    notes: string[]; // idk what else should be in an event
    start: Date;
    end: Date;
}

// A user's calendar
export type CalendarProps = {
    id: string;
    name: string;
    events: EventProps[];
}

export type UserProps = {
    id: string;
    username: string;
    calendar: CalendarProps;
}