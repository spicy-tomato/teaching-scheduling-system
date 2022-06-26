export type RequestChangeScheduleCode = [
  100,
  200,
  201,
  202,
  300,
  301,
  302,
  400,
  500,
  501
][number];

export type RequestChangeScheduleType =
  | 'cancel'
  | 'pending'
  | 'approve'
  | 'change'
  | 'deny';
