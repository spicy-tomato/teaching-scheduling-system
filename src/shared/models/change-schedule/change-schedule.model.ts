import { RequestChangeScheduleCode, SimpleModel } from '../core';

export interface ChangeSchedule {
  id: number;
  idSchedule: number;
  teacher: SimpleModel;
  moduleClassName: string;
  oldSchedule: {
    date: string;
    shift: string;
    room: string;
  };
  newSchedule: {
    date: string;
    shift: string;
    room: string;
  };
  reason: string;
  createdAt: Date;
  acceptedAt: Date;
  setRoomAt: Date;
  
  status: RequestChangeScheduleCode;
  moduleClassNumberReality: number;
}
