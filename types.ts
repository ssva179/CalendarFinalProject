// FEEL FREE TO EDIT OR CHANGE - file created by Edison

// An invite to a collaborational calendar from a user to another user
export type InviteStatus = "pending" | "accepted" | "declined";

// An invite from a User to another User to an Event
export type InviteProps = {
    id: string;
    eventId: string;       // the original event being shared
    fromEmail: string;     // inviter's email 
    toEmail: string;       // invitee's email
    status: InviteStatus;
    createdAt: Date;
    // Snapshot so the invite can be displayed without a join back to events.
    //  if the original event is edited, the invite won't reflectthe edit. Maybe fix in future, but should be fine as of rn.
    //Ask bidipta if need fixing
    eventSnapshot: {
        name: string;
        start: Date;
        end: Date;
        notes: string[];
    };
};

// An Event in a Calendar
export type EventProps = {
    id: string;
    name: string;
    notes: string[]; // idk what else should be in an event
    start: Date;
    end: Date;
    userEmail: string; //added by bidipta for saftey, if need remove, u can 
}

// A Calendar
export type CalendarProps = {
    id: string;
    name: string;
    events: EventProps[];
}

// A User's Calendar - seems to be unused, but i'll keep the prop uncommented just in case something breaks
export type UserProps = {
    id: string;
    username: string;
    calendar: CalendarProps;
}

// A User
export type User = {
    email: string;
    name: string;
    hasProfile: boolean;
    bio: string;
    phone: string;
    school: string;
}

export type stringEvent = {
    id: string;
    name: string;
    start: string;
    end: string;
    notes: string[];
    userEmail: string;
};