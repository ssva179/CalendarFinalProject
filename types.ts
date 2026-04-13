//
export type DateProps = {
    day: string;
    month: string;
    year: string; // maybe useful
    hour: string;
    minute: string;
    // im not putting seconds
}

export type EventProps = {
    id: string;
    name: string;
    start: Date;
    end: Date;
}