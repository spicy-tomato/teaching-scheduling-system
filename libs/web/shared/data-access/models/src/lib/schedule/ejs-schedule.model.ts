import { SimpleModel } from '../core/simple.model';
import { FixedScheduleModel } from './fixed-schedule.model';

export type EjsScheduleModelType = 'exam' | 'study' | 'googleEvent'

export interface EjsScheduleModel {
  /**
   * Assigns a unique ID value to each of the events.
   */
  Id: number | string;

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
   * Description about events
   */
  Description?: string;

  /**
   * Denote whether an event is created for an entire day or for specific time alone. Usually, an event with `isAllDay` field set to true will be considered as an all-day event.
   */
  IsAllDay?: boolean;

  /**
   * Type of event. Can be `study` or `exam`
   */
  Type: EjsScheduleModelType;

  /**
   * Module ID (subject) class at school of event
   */
  IdModuleClass?: string;

  /**
   * Module (subject) class at school of event
   */
  ModuleName?: string;

  /**
   * Note of event
   */
  Note: string;

  /**
   * Method of event
   */
  Method?: string;

  /**
   * People of event
   */
  People?: string[] | SimpleModel[];

  /**
   * Color of event
   */
  Color?: string;

  /**
   * Color of event
   */
  Shift?: string;

  /**
   * Fixed schedule
   */
  FixedSchedules?: FixedScheduleModel[];

  /**
   * elementType
   */
  elementType?: 'cell' | 'event';
}
