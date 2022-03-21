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
