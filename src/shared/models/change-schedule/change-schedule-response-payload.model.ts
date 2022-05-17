export interface ChangeScheduleResponsePayload {
  id: number;
  status: number;
  time: string;
  reasonDeny?: string;
  newIdRoom?: string;
}

export type ChangeScheduleCancelPayload = Omit<
  ChangeScheduleResponsePayload,
  'time' | 'comment'
>;

export interface AcceptChangeScheduleRequestPayload {
  acceptedAt: string;
}

export interface DenyChangeScheduleRequestPayload {
  reasonDeny: string;
}

export interface SetRoomChangeScheduleRequestPayload {
  setRoomAt: string;
  newIdRoom: string;
}

export interface IntendTimeChangeScheduleRequestPayload {
  newDate: string;
  newShift: string;
  newIdRoom: string;
}
