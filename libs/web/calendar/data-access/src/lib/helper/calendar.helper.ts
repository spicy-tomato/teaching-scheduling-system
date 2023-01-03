import { GoogleCalendar } from '@teaching-scheduling-system/web/shared/data-access/models';

export class CalendarHelper {
  static googleCalendarIsReadonly(calendar: GoogleCalendar): boolean {
    return (
      calendar.accessRole === 'freeBusyReader' ||
      calendar.accessRole === 'reader'
    );
  }
}
