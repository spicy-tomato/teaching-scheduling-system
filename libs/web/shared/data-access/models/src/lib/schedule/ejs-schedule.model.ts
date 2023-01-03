import { SimpleModel } from '../core/simple.model';
import { GoogleAttendees, GoogleCalendar } from '../google';
import { FixedScheduleModel } from './fixed-schedule.model';

export type EjsScheduleModelType = 'exam' | 'study' | 'googleEvent';

interface EjsScheduleCore {
  /**
   * Assigns the summary text to each of the events.
   */
  Subject?: string;

  /**
   * Defines the start time of an event and it is mandatory to provide it for any of the valid event objects.
   */
  StartTime?: Date;

  /**
   * Defines the end time of an event and it is mandatory to provide the end time for any of the valid event objects.
   */
  EndTime?: Date;

  /**
   * Displays the location of the events.
   */
  Location?: string;

  /**
   * Denote whether an event is created for an entire day or for specific time alone. Usually, an event with `isAllDay` field set to true will be considered as an all-day event.
   */
  IsAllDay?: boolean;

  /**
   * Note of event
   */
  Note: string;

  /**
   * Color of event
   */
  Color?: string;

  /**
   * EjsSchedule's property
   */
  elementType?: 'cell' | 'event';
}

type TssModel = EjsScheduleCore & {
  /**
   * Assigns a unique ID value to each of the events.
   */
  Id: number;

  /**
   * Module ID (subject) class at school of event
   */
  Type: 'exam' | 'study';

  /**
   * Module ID (subject) class at school of event
   */
  IdModuleClass: string;

  ReadOnly?: true;
};

export interface TssTeachingModel extends TssModel {
  /**
   * Shift of teaching schedule
   */
  Shift: string;

  /**
   * Module (subject) class at school of event
   */
  ModuleName: string;

  /**
   * People of event
   */
  People?: string[] | SimpleModel[];

  /**
   * Fixed schedule
   */
  FixedSchedules: FixedScheduleModel[];
}

export interface TssExamModel extends TssModel {
  /**
   * Method of event
   */
  Method: string;
  People: string[];
}

export type GoogleCalendarModel = EjsScheduleCore & {
  Id: string;
  Type: 'googleEvent';

  /**
   * Calendar of event in Google Calendar
   */
  Calendar: GoogleCalendar;

  People?: GoogleAttendees[];

  ReadOnly: boolean;
};

export type EjsScheduleModel =
  | TssTeachingModel
  | TssExamModel
  | GoogleCalendarModel;
