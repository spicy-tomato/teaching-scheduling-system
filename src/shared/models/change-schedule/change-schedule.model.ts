export interface ChangeSchedule {
  id: number;
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
  timeRequest: Date;
  timeAccept: Date;
  timeSetRoom: Date;
  status: number;
}
