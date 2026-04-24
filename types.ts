// FEEL FREE TO EDIT OR CHANGE

// An invite to a collaborational calendar from a user to another user
export type InviteStatus = "pending" | "accepted" | "declined";

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

// An event in a calendar
export type EventProps = {
    id: string;
    name: string;
    notes: string[]; // idk what else should be in an event
    start: Date;
    end: Date;
    userEmail: string; //added by bidipta for saftey, if need remove, u can 
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