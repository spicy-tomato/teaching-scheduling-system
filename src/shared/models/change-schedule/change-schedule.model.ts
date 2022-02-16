export interface ChangeSchedule {
  id: number;
  idSchedule: number;
  teacher: string;
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
  timeRequest: Date;
  timeAccept: Date;
  timeSetRoom: Date;
  status: number;
}
