import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import { EjsScheduleModel } from '../schedule';

export interface GoogleCalendar {
  accessRole: string;
  id: string;
  summary: string;
  description: Nullable<string>;
}

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
  start!: {
    date: Date;
    dateTime: Date;
    timeZone: string;
  };
  end!: {
    date: Date;
    dateTime: Date;
    timeZone: string;
  };
  reminders!: {
    useDefault: boolean;
  };

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

    return res;
  }

  toEjsSchedule(): EjsScheduleModel {
    return {
      Id: this.id,
      Subject: this.summary,
      StartTime: new Date(this.start.dateTime),
      EndTime: new Date(this.end.dateTime),
      Location: this.location ?? undefined,
      Type: 'googleEvent',
      Note: this.description || '',
      People: this.attendees?.map(({ displayName }) => displayName || ''),
    };
  }
}

export interface GoogleCalendarEventResponse {
  accessRole: string;
  id: string;
  summary: string;
  description: Nullable<string>;
  events: GoogleCalendarEvent[];
}
