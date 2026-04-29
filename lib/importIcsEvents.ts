/*
    Amir job - import
    the file handles importing events from .ics to database;

    .ics text is being parsed into VEVENT blocks (VEVENT represents a calendar event with properties)
    if event has RRULE => recurring event and needs to be expanded into multiple occurrences

    VEVENT = single event block between BEGIN:VEVENT and END:VEVENT
    RRULE = how event repeats
    FREQ = frequency of repition (DAILY, WEEKLY, MONTHLY, YEARLY)
    INTERVAL = how often repeats (every 2 weeks)
    COUNT = total number of occurrences
    UNTIL = last date of the event
    BYDAY = weekdays for recurrence (monday, wednesday)
    BYMONTHDAY = ^^ but for days of the month
    EXDATE = dates that are excluded from recurrence
*/

"use server";

import getCollection from "@/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const EVENTS_COLLECTION = "events-collection";
const MAX_RECURRING_OCCURRENCES = 5000;
const MS_IN_DAY = 24 * 60 * 60 * 1000;

type IcsProperty = {
  value: string;
  params: Record<string, string>;
};

type ParsedEvent = Record<string, IcsProperty[]>;

type ParsedRRule = {
  freq: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  interval: number;
  count?: number;
  until?: Date;
  byDay?: string[];
  byMonthDay?: number[];
};

type ImportResult = {
  importedCount: number;
  sourceEventCount: number;
  error?: string;
};

type DeleteResult = {
  deletedCount: number;
  error?: string;
};

// fixed the .ics lines;
// long lines can continue on the next line with a space or tab
function unfoldIcsLines(icsText: string): string[] {
  const rawLines = icsText
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n");
  const lines: string[] = [];

  for (const rawLine of rawLines) {
    if (
      (rawLine.startsWith(" ") || rawLine.startsWith("\t")) &&
      lines.length > 0
    ) {
      lines[lines.length - 1] += rawLine.slice(1);
      continue;
    }

    lines.push(rawLine);
  }

  return lines;
}

// parses 1 .ics property line into name, value, parameters
function parseProperty(
  line: string
): { name: string; prop: IcsProperty } | null {
  const colonIndex = line.indexOf(":");
  if (colonIndex === -1) {
    return null;
  }

  const left = line.slice(0, colonIndex);
  const value = line.slice(colonIndex + 1);
  const [rawName, ...rawParams] = left.split(";");
  const params: Record<string, string> = {};

  for (const rawParam of rawParams) {
    const [key, rawValue = ""] = rawParam.split("=");
    params[key.toUpperCase()] = rawValue;
  }

  return {
    name: rawName.toUpperCase(),
    prop: {
      value,
      params,
    },
  };
}

// finds all VEVENT blocks in the .ics and stores their properties
function parseEvents(icsText: string): ParsedEvent[] {
  const lines = unfoldIcsLines(icsText);
  const events: ParsedEvent[] = [];
  let currentEvent: ParsedEvent | null = null;

  for (const line of lines) {
    if (!line.trim()) {
      continue;
    }

    const parsed = parseProperty(line);
    if (!parsed) {
      continue;
    }

    if (parsed.name === "BEGIN" && parsed.prop.value === "VEVENT") {
      currentEvent = {};
      continue;
    }

    if (parsed.name === "END" && parsed.prop.value === "VEVENT") {
      if (currentEvent) {
        events.push(currentEvent);
      }
      currentEvent = null;
      continue;
    }

    if (!currentEvent) {
      continue;
    }

    if (!currentEvent[parsed.name]) {
      currentEvent[parsed.name] = [];
    }

    currentEvent[parsed.name].push(parsed.prop);
  }

  return events;
}

// converts .ics date strings into JS Date objects;
// supports all day dates and local times
function parseDateValue(
  rawValue: string,
  params: Record<string, string> = {}
): Date | null {
  const valueType = params.VALUE?.toUpperCase();

  if (valueType === "DATE" || /^\d{8}$/.test(rawValue)) {
    const match = rawValue.match(/^(\d{4})(\d{2})(\d{2})$/);
    if (!match) {
      return null;
    }

    const [, year, month, day] = match;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const utcMatch = rawValue.match(
    /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/
  );
  if (utcMatch) {
    const [, year, month, day, hour, minute, second] = utcMatch;
    return new Date(
      Date.UTC(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
        Number(second)
      )
    );
  }

  const localMatch = rawValue.match(
    /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})?$/
  );
  if (localMatch) {
    const [, year, month, day, hour, minute, second = "0"] = localMatch;
    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second)
    );
  }

  return null;
}

// parses the UNTIL of RRULE;
// all day events are treated until the end of the day
function parseUntil(rawValue: string): Date | undefined {
  const parsed = parseDateValue(rawValue);
  if (!parsed) {
    return undefined;
  }

  if (/^\d{8}$/.test(rawValue)) {
    parsed.setHours(23, 59, 59, 999);
  }

  return parsed;
}

// parses the reccurence rule from .ics;
// supports daily, weekly, monthly, yearly
function parseRRule(rawValue: string): ParsedRRule | null {
  const parts = rawValue.split(";");
  const values: Record<string, string> = {};
  const supportedKeys = new Set([
    "FREQ",
    "INTERVAL",
    "COUNT",
    "UNTIL",
    "BYDAY",
    "BYMONTHDAY",
  ]);

  for (const part of parts) {
    const [key, value] = part.split("=");
    if (!key || !value) {
      continue;
    }

    const upperKey = key.toUpperCase();
    if (!supportedKeys.has(upperKey)) {
      return null;
    }

    values[upperKey] = value;
  }

  const freq = values.FREQ?.toUpperCase();
  if (!freq || !["DAILY", "WEEKLY", "MONTHLY", "YEARLY"].includes(freq)) {
    return null;
  }

  const byDay = values.BYDAY
    ? values.BYDAY.split(",").map((value) => value.toUpperCase())
    : undefined;
  const byMonthDay = values.BYMONTHDAY
    ? values.BYMONTHDAY.split(",")
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value))
    : undefined;

  if (
    byDay?.some(
      (value) => !["SU", "MO", "TU", "WE", "TH", "FR", "SA"].includes(value)
    )
  ) {
    return null;
  }

  if ((freq === "MONTHLY" || freq === "YEARLY") && byDay && byDay.length > 0) {
    return null;
  }

  if (
    (freq === "DAILY" || freq === "WEEKLY") &&
    byMonthDay &&
    byMonthDay.length > 0
  ) {
    return null;
  }

  return {
    freq: freq as ParsedRRule["freq"],
    interval: Math.max(1, Number(values.INTERVAL || "1")),
    count: values.COUNT ? Number(values.COUNT) : undefined,
    until: values.UNTIL ? parseUntil(values.UNTIL) : undefined,
    byDay,
    byMonthDay,
  };
}

// for daily occurences
function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

// for monthly occurences
function addMonths(date: Date, months: number): Date {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

// for yearly occurences
function addYears(date: Date, years: number): Date {
  const next = new Date(date);
  next.setFullYear(next.getFullYear() + years);
  return next;
}

// gets the 1st value for a property from event
function getProperty(event: ParsedEvent, key: string): IcsProperty | undefined {
  return event[key]?.[0];
}

// gets all values for a property
function getProperties(event: ParsedEvent, key: string): IcsProperty[] {
  return event[key] ?? [];
}

// converts JS weekday into .ics weekday
function getWeekdayCode(date: Date): string {
  return ["SU", "MO", "TU", "WE", "TH", "FR", "SA"][date.getDay()];
}

// check if a monthly date is still inside the expected month
function isSameMonth(date: Date, monthDate: Date): boolean {
  return (
    date.getFullYear() === monthDate.getFullYear() &&
    date.getMonth() === monthDate.getMonth()
  );
}

// copies time from original start date onto another date
function setTimeFromSource(day: Date, source: Date): Date {
  const next = new Date(day);
  next.setHours(
    source.getHours(),
    source.getMinutes(),
    source.getSeconds(),
    source.getMilliseconds()
  );
  return next;
}

// EXDATE values so skipped recurrences are not imported
function getExDates(event: ParsedEvent): Set<number> {
  const exDates = new Set<number>();

  for (const prop of getProperties(event, "EXDATE")) {
    const rawValues = prop.value.split(",");
    for (const rawValue of rawValues) {
      const parsed = parseDateValue(rawValue, prop.params);
      if (parsed) {
        exDates.add(parsed.getTime());
      }
    }
  }

  return exDates;
}

// when recurrence should stop
function shouldStop(
  nextDate: Date,
  rule: ParsedRRule,
  importedCount: number
): boolean {
  if (rule.count && importedCount >= rule.count) {
    return true;
  }

  if (rule.until && nextDate > rule.until) {
    return true;
  }

  return importedCount >= MAX_RECURRING_OCCURRENCES;
}

// expands recurring .ics events into a list of start dates;
// limit to prevent infinite recurrences
function expandRecurringStarts(
  start: Date,
  event: ParsedEvent,
  rule: ParsedRRule
): Date[] {
  if (!rule.count && !rule.until) {
    throw new Error("Recurring events must include an end date or count.");
  }

  const exDates = getExDates(event);
  const starts: Date[] = [];

  const maybePush = (date: Date) => {
    if (date < start) {
      return;
    }

    if (rule.until && date > rule.until) {
      return;
    }

    if (exDates.has(date.getTime())) {
      return;
    }

    starts.push(date);
  };

  if (rule.freq === "DAILY") {
    for (let index = 0; index < MAX_RECURRING_OCCURRENCES; index += 1) {
      const nextDate = addDays(start, index * rule.interval);
      if (shouldStop(nextDate, rule, starts.length)) {
        break;
      }

      if (rule.byDay && !rule.byDay.includes(getWeekdayCode(nextDate))) {
        continue;
      }

      maybePush(nextDate);
    }

    return starts;
  }

  if (rule.freq === "WEEKLY") {
    const allowedDays =
      rule.byDay && rule.byDay.length > 0
        ? new Set(rule.byDay)
        : new Set([getWeekdayCode(start)]);

    for (let offset = 0; offset < MAX_RECURRING_OCCURRENCES * 7; offset += 1) {
      const day = addDays(start, offset);
      const weeksSinceStart = Math.floor(
        (day.getTime() - start.getTime()) / (7 * MS_IN_DAY)
      );

      if (rule.until && day > rule.until) {
        break;
      }

      if (weeksSinceStart % rule.interval !== 0) {
        continue;
      }

      if (!allowedDays.has(getWeekdayCode(day))) {
        continue;
      }

      const nextDate = setTimeFromSource(day, start);
      if (shouldStop(nextDate, rule, starts.length)) {
        break;
      }

      maybePush(nextDate);
    }

    return starts;
  }

  if (rule.freq === "MONTHLY") {
    const monthDays =
      rule.byMonthDay && rule.byMonthDay.length > 0
        ? [...rule.byMonthDay].sort((a, b) => a - b)
        : [start.getDate()];

    for (
      let monthOffset = 0;
      monthOffset < MAX_RECURRING_OCCURRENCES;
      monthOffset += rule.interval
    ) {
      const monthBase = addMonths(start, monthOffset);

      for (const monthDay of monthDays) {
        const candidate = new Date(
          monthBase.getFullYear(),
          monthBase.getMonth(),
          monthDay,
          start.getHours(),
          start.getMinutes(),
          start.getSeconds(),
          start.getMilliseconds()
        );

        if (!isSameMonth(candidate, monthBase)) {
          continue;
        }

        if (shouldStop(candidate, rule, starts.length)) {
          return starts;
        }

        maybePush(candidate);
      }
    }

    return starts;
  }

  for (
    let yearOffset = 0;
    yearOffset < MAX_RECURRING_OCCURRENCES;
    yearOffset += rule.interval
  ) {
    const candidate = addYears(start, yearOffset);
    if (shouldStop(candidate, rule, starts.length)) {
      break;
    }

    maybePush(candidate);
  }

  return starts;
}

// mongodb documents for parsed events;
// normal event creates 1 document and recurring creates many
function buildEventDocuments(parsedEvent: ParsedEvent, userEmail: string) {
  const summary =
    getProperty(parsedEvent, "SUMMARY")?.value?.trim() || "Imported Event";
  const description = getProperty(parsedEvent, "DESCRIPTION")
    ?.value?.replace(/\\n/g, "\n")
    .trim();
  const startProp = getProperty(parsedEvent, "DTSTART");
  const endProp = getProperty(parsedEvent, "DTEND");
  const ruleProp = getProperty(parsedEvent, "RRULE");

  if (!startProp) {
    return [];
  }

  const start = parseDateValue(startProp.value, startProp.params);
  if (!start) {
    return [];
  }

  let end = endProp ? parseDateValue(endProp.value, endProp.params) : null;
  if (!end) {
    end =
      startProp.params.VALUE?.toUpperCase() === "DATE"
        ? addDays(start, 1)
        : new Date(start);
  }

  const duration = Math.max(0, end.getTime() - start.getTime());
  const notes = description ? [description] : [];
  let starts: Date[] = [start];

  if (ruleProp) {
    const rule = parseRRule(ruleProp.value);

    if (!rule) {
      throw new Error("Unsupported RRULE in imported file.");
    }

    starts = expandRecurringStarts(start, parsedEvent, rule);
  }

  return starts.map((eventStart) => ({
    name: summary,
    start: eventStart,
    end: new Date(eventStart.getTime() + duration),
    notes,
    userEmail,
    eventSource: "ics",
    importedFromIcs: true,
  }));
}

// server action for import page;
// checks the user session and parses the .ics text and saves the created event documents in mongodb
export async function importIcsEvents(icsText: string): Promise<ImportResult> {
  const session = await auth();
  const userEmail = session?.user?.email;

  if (!userEmail) {
    return {
      importedCount: 0,
      sourceEventCount: 0,
      error: "You must be logged in to import events.",
    };
  }

  if (!icsText.trim()) {
    return {
      importedCount: 0,
      sourceEventCount: 0,
      error: "The uploaded file is empty.",
    };
  }

  try {
    const parsedEvents = parseEvents(icsText);
    const builtEvents = parsedEvents.map((parsedEvent) =>
      buildEventDocuments(parsedEvent, userEmail)
    );
    const validSourceEventCount = builtEvents.filter(
      (eventGroup) => eventGroup.length > 0
    ).length;
    const documents = builtEvents.flat();

    if (documents.length === 0) {
      return {
        importedCount: 0,
        sourceEventCount: 0,
        error: "No valid events were found in the file.",
      };
    }

    const eventsCollection = await getCollection(EVENTS_COLLECTION);
    const result = await eventsCollection.insertMany(documents);

    revalidatePath("/calendar");
    revalidatePath("/calendar/import");

    return {
      importedCount: result.insertedCount,
      sourceEventCount: validSourceEventCount,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to import the .ics file.";
    return { importedCount: 0, sourceEventCount: 0, error: message };
  }
}

// server action used to delete imported events
export async function deleteImportedEvents(): Promise<DeleteResult> {
  const session = await auth();
  const userEmail = session?.user?.email;

  if (!userEmail) {
    return {
      deletedCount: 0,
      error: "You must be logged in to delete imported events.",
    };
  }

  const eventsCollection = await getCollection(EVENTS_COLLECTION);
  const result = await eventsCollection.deleteMany({
    userEmail,
    eventSource: "ics",
  });

  revalidatePath("/calendar");
  revalidatePath("/calendar/import");

  return { deletedCount: result.deletedCount };
}
