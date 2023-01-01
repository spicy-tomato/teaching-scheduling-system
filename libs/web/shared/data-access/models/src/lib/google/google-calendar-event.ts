import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import { EjsScheduleModel } from '../schedule';

export type GoogleDateTime =
  | {
      date: string;
      dateTime?: null;
      timeZone: Nullable<string>;
    }
  | {
      date?: null;
      dateTime: string;
      timeZone: Nullable<string>;
    };

export interface GoogleCalendar {
  accessRole: string;
  id: string;
  summary: string;
  description: Nullable<string>;
}

export type DefaultGoogleCalendarEvent = {
  start: GoogleDateTime;
  end: GoogleDateTime;
  description: string;
  summary: string;
  location: string;
};

export class GoogleCalendarEvent {
  anyoneCanAddSelf!: Nullable<boolean>;
  attendees?: {
    self: boolean;
    displayName: Nullable<string>;
  }[];
  attendeesOmitted!: Nullable<boolean>;
  colorId!: Nullable<string>;
  created!: Date;
  description!: null;
  endTimeUnspecified!: null;
  etag!: string;
  eventType!: 'default' | 'outOfOffice' | 'focusTime';
  guestsCanInviteOthers!: Nullable<boolean>;
  guestsCanModify!: Nullable<boolean>;
  guestsCanSeeOtherGuests!: Nullable<boolean>;
  hangoutLink!: Nullable<string>;
  htmlLink!: string;
  iCalUID!: string;
  id!: string;
  kind!: string;
  location!: Nullable<string>;
  locked!: Nullable<boolean>;
  privateCopy!: Nullable<boolean>;
  recurrence!: Nullable<[]>;
  recurringEventId!: Nullable<string>;
  sequence!: number;
  status!: 'confirmed' | 'tentative' | 'cancelled';
  summary!: string;
  transparency!: Nullable<'opaque' | 'transparent'>;
  updated!: Date;
  visibility!: Nullable<'default' | 'public' | 'private' | 'confidential'>;
  creator!: {
    displayName: Nullable<string>;
    email: string;
    id: Nullable<string>;
    self: boolean;
  };
  organizer!: {
    displayName: Nullable<string>;
    email: string;
    id: Nullable<string>;
    self: boolean;
  };
  start!: GoogleDateTime;
  end!: GoogleDateTime;
  reminders!: {
    useDefault: boolean;
  };
  // Additional properties
  calendar!: Omit<GoogleCalendarEventResponse, 'events'>;

  static parse(obj: GoogleCalendarEvent): GoogleCalendarEvent {
    const res = new GoogleCalendarEvent();
    res.anyoneCanAddSelf = obj.anyoneCanAddSelf;
    res.attendeesOmitted = obj.attendeesOmitted;
    res.attendees = obj.attendees;
    res.colorId = obj.colorId;
    res.created = obj.created;
    res.description = obj.description;
    res.endTimeUnspecified = obj.endTimeUnspecified;
    res.etag = obj.etag;
    res.eventType = obj.eventType;
    res.guestsCanInviteOthers = obj.guestsCanInviteOthers;
    res.guestsCanModify = obj.guestsCanModify;
    res.guestsCanSeeOtherGuests = obj.guestsCanSeeOtherGuests;
    res.hangoutLink = obj.hangoutLink;
    res.htmlLink = obj.htmlLink;
    res.iCalUID = obj.iCalUID;
    res.id = obj.id;
    res.kind = obj.kind;
    res.location = obj.location;
    res.locked = obj.locked;
    res.privateCopy = obj.privateCopy;
    res.recurrence = obj.recurrence;
    res.recurringEventId = obj.recurringEventId;
    res.sequence = obj.sequence;
    res.status = obj.status;
    res.summary = obj.summary;
    res.transparency = obj.transparency;
    res.updated = obj.updated;
    res.visibility = obj.visibility;
    res.creator = obj.creator;
    res.organizer = obj.organizer;
    res.start = obj.start;
    res.end = obj.end;
    res.reminders = obj.reminders;
    res.calendar = obj.calendar;

    return res;
  }

  toEjsSchedule(): EjsScheduleModel {
    return {
      Id: this.id,
      Subject: this.summary,
      StartTime: new Date(this.start.dateTime ?? this.start.date),
      EndTime: new Date(this.end.dateTime ?? this.end.date),
      Location: this.location ?? undefined,
      Type: 'googleEvent',
      Note: this.description || '',
      People: this.attendees?.map(({ displayName }) => displayName || ''),
      Calendar: this.calendar,
      IsAllDay: !!this.start.date,
    };
  }
}

export interface GoogleCalendarEventHost {
  accessRole: string;
  id: string;
  summary: string;
  description: Nullable<string>;
}

export interface GoogleCalendarEventResponse extends GoogleCalendarEventHost {
  events: GoogleCalendarEvent[];
}
